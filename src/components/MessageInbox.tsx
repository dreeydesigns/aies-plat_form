import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Send, User } from 'lucide-react';
import EmptyState from './shared/EmptyState';
import { db } from '../lib/firebase';
import { collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import VoiceInput from './shared/VoiceInput';
import AudioRecorder from './shared/AudioRecorder';

interface Message {
  id: string;
  senderId: string;
  recipientId: string;
  participants: string[];
  text: string;
  audioUrl?: string;
  timestamp: string;
  createdAt?: Timestamp | null;
}

function formatTimestamp(ts?: Timestamp | null) {
  if (!ts) return 'Sending...';
  const date = ts.toDate();
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

interface MessageInboxProps {
  currentUser: any;
  contacts: any[];
}

export default function MessageInbox({ currentUser, contacts }: MessageInboxProps) {
  const [searchParams] = useSearchParams();
  const initialContactId = searchParams.get('contactId');
  const [selectedContact, setSelectedContact] = useState<any | null>(null);

  useEffect(() => {
    if (initialContactId && contacts.length > 0 && !selectedContact) {
      const contact = contacts.find(c => c.id === initialContactId);
      if (contact) setSelectedContact(contact);
    }
  }, [initialContactId, contacts, selectedContact]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);

  // Real-time, persisted conversation thread — keyed by a sorted pair of user IDs
  // so the same thread is found regardless of who opens it first.
  useEffect(() => {
    if (!currentUser || !selectedContact) {
      setMessages([]);
      return;
    }
    const threadId = [currentUser.id, selectedContact.id].sort().join('_');
    const q = query(
      collection(db, 'messages'),
      where('threadId', '==', threadId),
      orderBy('createdAt', 'asc')
    );
    const unsubscribe = onSnapshot(q, snapshot => {
      const msgs: Message[] = snapshot.docs.map(d => {
        const data = d.data() as any;
        return {
          id: d.id,
          senderId: data.senderId,
          recipientId: data.recipientId,
          participants: data.participants,
          text: data.text,
          audioUrl: data.audioUrl,
          createdAt: data.createdAt,
          timestamp: formatTimestamp(data.createdAt),
        };
      });
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [currentUser?.id, selectedContact?.id]);

  const handleSend = async (audioUrl?: string) => {
    if ((!newMessage.trim() && !audioUrl) || !selectedContact || sending) return;
    const threadId = [currentUser.id, selectedContact.id].sort().join('_');
    const text = newMessage;
    setNewMessage('');
    setSending(true);
    try {
      const messageData: any = {
        threadId,
        senderId: currentUser.id,
        recipientId: selectedContact.id,
        participants: [currentUser.id, selectedContact.id],
        text,
        createdAt: serverTimestamp(),
      };
      if (audioUrl) {
        messageData.audioUrl = audioUrl;
      }
      await addDoc(collection(db, 'messages'), messageData);
    } catch (e) {
      console.error('Failed to send message', e);
      if (!audioUrl) setNewMessage(text); // restore the draft so nothing is lost
    } finally {
      setSending(false);
    }
  };

  const filteredMessages = messages;

  return (
    <div className="flex h-[600px] bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
      <div className="w-1/3 border-r border-neutral-200 bg-neutral-50 overflow-y-auto">
        <div className="p-4 border-b border-neutral-200 font-bold text-neutral-800">Messages</div>
        {contacts.length === 0 ? (
          <div className="p-4 text-center text-neutral-500 text-sm">No contacts available.</div>
        ) : (
          contacts.map(contact => (
            <div 
              key={contact.id} 
              onClick={() => setSelectedContact(contact)}
              className={`p-4 border-b border-neutral-100 flex items-center gap-3 cursor-pointer transition-colors ${selectedContact?.id === contact.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-neutral-100 border-l-4 border-l-transparent'}`}
            >
              <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
                {contact.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-neutral-800 truncate">{contact.name}</h4>
                <p className="text-xs text-neutral-500 capitalize">{contact.role}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="w-2/3 flex flex-col">
        {selectedContact ? (
          <>
            <div className="p-4 border-b border-neutral-200 flex items-center gap-3 bg-white">
              <div className="w-10 h-10 bg-neutral-200 rounded-full flex items-center justify-center font-bold text-neutral-600">
                {selectedContact.name.charAt(0)}
              </div>
              <h4 className="font-semibold text-neutral-800">{selectedContact.name}</h4>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-neutral-50/50">
              {filteredMessages.length === 0 ? (
                <div className="h-full flex items-center justify-center text-neutral-400 text-sm">No messages yet.</div>
              ) : (
                filteredMessages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.senderId === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2 ${msg.senderId === currentUser.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white border border-neutral-200 text-neutral-800 rounded-bl-none'}`}>
                      {msg.text && <p className="text-sm">{msg.text}</p>}
                      {msg.audioUrl && (
                        <audio controls src={msg.audioUrl} className="mt-2 w-full max-w-[200px]" />
                      )}
                      <p className={`text-[10px] mt-1 ${msg.senderId === currentUser.id ? 'text-blue-200' : 'text-neutral-400'}`}>{msg.timestamp}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-4 border-t border-neutral-200 bg-white flex items-center gap-2">
              <AudioRecorder onAudioReady={(url) => handleSend(url)} />
              <VoiceInput onTranscript={(text) => setNewMessage(prev => prev + ' ' + text)} />
              <input 
                type="text" 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
              <button 
                onClick={() => handleSend()}
                disabled={!newMessage.trim()}
                className="p-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState 
              icon={User}
              title="Select a contact"
              description="Choose a person from the list on the left to start messaging."
            />
          </div>
        )}
      </div>
    </div>
  );
}
