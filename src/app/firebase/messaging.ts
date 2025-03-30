// src/app/firebase/messaging.ts
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  serverTimestamp,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Send a new message
export const sendMessage = async (senderId: string, receiverId: string, content: string) => {
  try {
    // Get conversation ID or create a new conversation
    const conversationId = await getOrCreateConversation(senderId, receiverId);
    
    // Add message to the messages collection
    await addDoc(collection(db, 'messages'), {
      conversationId,
      senderId,
      receiverId,
      content,
      read: false,
      createdAt: serverTimestamp(),
    });
    
    // Update conversation with last message
    await updateDoc(doc(db, 'conversations', conversationId), {
      lastMessage: content,
      lastMessageTime: serverTimestamp(),
      lastMessageSenderId: senderId,
      [`unreadCount.${receiverId}`]: increment(`unreadCount.${receiverId}`),
    });
    
    return { success: true, conversationId };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Get or create a conversation between two users
export const getOrCreateConversation = async (userId1: string, userId2: string) => {
  // Sort user IDs to ensure consistent conversation ID
  const sortedUserIds = [userId1, userId2].sort();
  
  // Check if conversation already exists
  const conversationsRef = collection(db, 'conversations');
  const q = query(
    conversationsRef,
    where('participants', '==', sortedUserIds)
  );
  
  const querySnapshot = await getDocs(q);
  
  if (!querySnapshot.empty) {
    // Return existing conversation ID
    return querySnapshot.docs[0].id;
  }
  
  // Create new conversation
  const newConversationRef = await addDoc(conversationsRef, {
    participants: sortedUserIds,
    participantsMap: {
      [userId1]: true,
      [userId2]: true,
    },
    createdAt: serverTimestamp(),
    lastMessage: '',
    lastMessageTime: serverTimestamp(),
    lastMessageSenderId: '',
    unreadCount: {
      [userId1]: 0,
      [userId2]: 0,
    },
  });
  
  return newConversationRef.id;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string) => {
  try {
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      orderBy('createdAt', 'asc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return {
      success: true,
      messages: querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Get conversations for a user
export const getConversations = async (userId: string) => {
  try {
    const conversationsRef = collection(db, 'conversations');
    const q = query(
      conversationsRef,
      where(`participantsMap.${userId}`, '==', true),
      orderBy('lastMessageTime', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    
    return {
      success: true,
      conversations: querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      })),
    };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, userId: string) => {
  try {
    // Update conversation unread count
    await updateDoc(doc(db, 'conversations', conversationId), {
      [`unreadCount.${userId}`]: 0,
    });
    
    // Get all unread messages sent to this user
    const messagesRef = collection(db, 'messages');
    const q = query(
      messagesRef,
      where('conversationId', '==', conversationId),
      where('receiverId', '==', userId),
      where('read', '==', false)
    );
    
    const querySnapshot = await getDocs(q);
    
    // Update each message
    const batch = db.batch();
    querySnapshot.docs.forEach(docSnapshot => {
      batch.update(docSnapshot.ref, { read: true });
    });
    
    await batch.commit();
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message 
    };
  }
};

// Helper function to increment a field value
const increment = (field: string) => {
  return {
    [field]: firebase.firestore.FieldValue.increment(1)
  };
};
