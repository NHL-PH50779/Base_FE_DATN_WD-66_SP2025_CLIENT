import React, { useState, useEffect, useRef } from 'react';
import {
  Card, CardContent, TextField, Button, Avatar, Tabs, Tab, Box,
  Typography, Fab, IconButton, Paper
} from '@mui/material';
import {
  Message as MessageIcon, SmartToy as RobotIcon, Person as UserIcon,
  Send as SendIcon, SupportAgent as AdminIcon, Close as CloseIcon
} from '@mui/icons-material';
import axiosInstance from '../utils/axios.util';

interface Message {
  id: number;
  type: 'user' | 'bot' | 'admin';
  message: string;
  timestamp: string;
}

interface ChatMessage {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  sender: { id: number; name: string };
}

const ChatBot = () => {
  const [visible, setVisible] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  
  // AI Chat
  const [aiMessages, setAiMessages] = useState<Message[]>([]);
  const [aiInput, setAiInput] = useState('');
  const [aiLoading, setAiLoading] = useState(false);
  
  // Human Chat
  const [humanMessages, setHumanMessages] = useState<ChatMessage[]>([]);
  const [humanInput, setHumanInput] = useState('');
  const [humanLoading, setHumanLoading] = useState(false);
  const [chatId, setChatId] = useState<number | null>(null);
  
  const aiMessagesEndRef = useRef<HTMLDivElement>(null);
  const humanMessagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = (ref: React.RefObject<HTMLDivElement>) => {
    ref.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendAIMessage = async () => {
    if (!aiInput.trim()) return;
    
    const userMessage: Message = {
      id: Date.now(),
      type: 'user',
      message: aiInput,
      timestamp: new Date().toISOString()
    };
    
    setAiMessages(prev => [...prev, userMessage]);
    const currentInput = aiInput;
    setAiInput('');
    setAiLoading(true);
    setTimeout(() => scrollToBottom(aiMessagesEndRef), 100);
    
    // Smart AI responses with real product search
    const processAIRequest = async () => {
      try {
        let botResponse = '';
        
        // Tìm kiếm sản phẩm thông minh
        if (currentInput.toLowerCase().includes('sản phẩm') || currentInput.toLowerCase().includes('tìm') || currentInput.toLowerCase().includes('giá')) {
          try {
            // Sử dụng API search đã cải thiện
            const response = await axiosInstance.get(`/products/search?keyword=${encodeURIComponent(currentInput)}`);
            const products = response.data.data || [];
            const message = response.data.message || '';
            
            if (products.length > 0) {
              const productList = products.slice(0, 5).map((p: any) => {
                const price = p.price || (p.variants && p.variants[0] ? p.variants[0].price : 0);
                return `• ${p.name} - ${new Intl.NumberFormat('vi-VN').format(price)} VND\n  🔗 Xem chi tiết: http://localhost:5174/product/${p.id}`;
              }).join('\n\n');
              
              botResponse = `${message}:\n\n${productList}\n\nBạn có thể click vào link để xem chi tiết sản phẩm hoặc liên hệ admin để được tư vấn thêm.`;
            } else {
              botResponse = message || 'Không tìm thấy sản phẩm phù hợp. Bạn có thể thử tìm với từ khóa khác hoặc liên hệ admin để được hỗ trợ.';
            }
          } catch (error) {
            botResponse = 'Không thể tìm kiếm sản phẩm lúc này. Vui lòng thử lại sau hoặc liên hệ admin để được hỗ trợ.';
          }
        } else if (currentInput.toLowerCase().includes('đơn hàng') || currentInput.toLowerCase().includes('order') || 
                   currentInput.toLowerCase().includes('đơn') || currentInput.toLowerCase().includes('giao') ||
                   currentInput.toLowerCase().includes('đã giao') || currentInput.toLowerCase().includes('đang giao')) {

          try {
            const token = localStorage.getItem('token');
            if (token) {
              const response = await axiosInstance.get('/my-orders');
              const orders = response.data.data || response.data || [];
              
              if (currentInput.toLowerCase().includes('hủy') || currentInput.toLowerCase().includes('cancel')) {
                const cancelledOrders = orders.filter((o: any) => o.order_status_id === 6);
                
                if (cancelledOrders.length > 0) {
                  const orderList = cancelledOrders.slice(0, 5).map((o: any) => 
                    `• Đơn #${o.id} - ${new Intl.NumberFormat('vi-VN').format(o.total)} VND - ${new Date(o.created_at).toLocaleDateString('vi-VN')}`
                  ).join('\n');
                  
                  botResponse = `Bạn có ${cancelledOrders.length} đơn hàng đã hủy:\n\n${orderList}\n\nBạn có thể xem chi tiết trong mục "Đơn hàng của tôi".`;
                } else {
                  botResponse = 'Bạn không có đơn hàng nào đã bị hủy.';
                }
              } else if (currentInput.toLowerCase().includes('đang giao') || currentInput.toLowerCase().includes('giao')) {
                const shippingOrders = orders.filter((o: any) => o.order_status_id === 3); // Đang giao
                const deliveredOrders = orders.filter((o: any) => o.order_status_id === 4); // Đã giao
                
                if (currentInput.toLowerCase().includes('đã giao')) {
                  if (deliveredOrders.length > 0) {
                    const orderList = deliveredOrders.slice(0, 5).map((o: any) => 
                      `• Đơn #${o.id} - ${new Intl.NumberFormat('vi-VN').format(o.total)} VND - ${new Date(o.created_at).toLocaleDateString('vi-VN')}`
                    ).join('\n');
                    
                    botResponse = `Bạn có ${deliveredOrders.length} đơn hàng đã giao:\n\n${orderList}\n\nBạn có thể xác nhận hoàn thành đơn hàng trong mục "Đơn hàng của tôi".`;
                  } else {
                    botResponse = 'Bạn chưa có đơn hàng nào đã giao.';
                  }
                } else {
                  if (shippingOrders.length > 0) {
                    const orderList = shippingOrders.slice(0, 5).map((o: any) => 
                      `• Đơn #${o.id} - ${new Intl.NumberFormat('vi-VN').format(o.total)} VND - ${new Date(o.created_at).toLocaleDateString('vi-VN')}`
                    ).join('\n');
                    
                    botResponse = `Bạn có ${shippingOrders.length} đơn hàng đang giao:\n\n${orderList}\n\nBạn có thể theo dõi trong mục "Đơn hàng của tôi".`;
                  } else {
                    botResponse = 'Bạn không có đơn hàng nào đang giao.';
                  }
                }
              } else {
                const recentOrders = orders.slice(0, 5).map((o: any) => {
                  const statusText = o.order_status_id === 1 ? 'Chờ xác nhận' : 
                                   o.order_status_id === 2 ? 'Đã xác nhận' :
                                   o.order_status_id === 3 ? 'Đang giao' :
                                   o.order_status_id === 4 ? 'Đã giao' :
                                   o.order_status_id === 5 ? 'Hoàn thành' :
                                   o.order_status_id === 6 ? 'Đã hủy' : 'Khác';
                  return `• Đơn #${o.id} - ${statusText} - ${new Intl.NumberFormat('vi-VN').format(o.total)} VND`;
                }).join('\n');
                
                botResponse = `Đây là ${Math.min(orders.length, 5)} đơn hàng gần nhất của bạn:\n\n${recentOrders}\n\nBạn có thể xem chi tiết trong mục "Đơn hàng của tôi".`;
              }
            } else {
              botResponse = 'Vui lòng đăng nhập để xem thông tin đơn hàng của bạn.';
            }
          } catch (error) {
            botResponse = 'Bạn có thể kiểm tra đơn hàng trong mục "Đơn hàng của tôi". Nếu cần hỗ trợ về đơn hàng cụ thể, vui lòng cung cấp mã đơn hàng hoặc liên hệ admin.';
          }
        } else if (currentInput.toLowerCase().includes('thanh toán') || currentInput.toLowerCase().includes('payment')) {
          botResponse = 'Chúng tôi hỗ trợ thanh toán qua VNPay, MoMo, COD và ví điện tử. Tất cả giao dịch đều được bảo mật an toàn.';
        } else if (currentInput.toLowerCase().includes('giao hàng') || currentInput.toLowerCase().includes('ship')) {
          botResponse = 'Chúng tôi giao hàng toàn quốc trong 1-3 ngày. Phí ship từ 30.000đ tùy khu vực. Miễn phí ship cho đơn hàng trên 1 triệu.';
        } else if (currentInput.toLowerCase().match(/^(xin chào|chào|hello|hi|hey)$/i)) {
          botResponse = 'Xin chào! Tôi là trợ lý ảo của TechStore. Bạn cần hỗ trợ gì hôm nay?';
        } else {
          botResponse = 'Tôi có thể hỗ trợ bạn:\n\n• Tìm sản phẩm theo giá: "sản phẩm trên 20 triệu"\n• Kiểm tra đơn hàng: "đơn hàng của tôi"\n• Đơn hàng đã hủy: "đơn hàng đã hủy"\n• Thanh toán và giao hàng\n\nBạn muốn hỏi gì?';
        }
        
        const botMessage: Message = {
          id: Date.now() + 1,
          type: 'bot',
          message: botResponse,
          timestamp: new Date().toISOString()
        };
        
        setAiMessages(prev => [...prev, botMessage]);
        setTimeout(() => scrollToBottom(aiMessagesEndRef), 100);
      } catch (error) {
        console.error('AI Error:', error);
        const botMessage: Message = {
          id: Date.now() + 1,
          type: 'bot',
          message: 'Xin lỗi, tôi gặp sự cố khi xử lý yêu cầu. Vui lòng thử lại hoặc liên hệ admin.',
          timestamp: new Date().toISOString()
        };
        setAiMessages(prev => [...prev, botMessage]);
        setTimeout(() => scrollToBottom(aiMessagesEndRef), 100);
      } finally {
        setAiLoading(false);
      }
    };
    
    setTimeout(processAIRequest, 1000);
  };

  const startHumanChat = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.post('/chat/start');
      setChatId(response.data.data.id);
      fetchHumanMessages(response.data.data.id);
    } catch (error) {
      console.error('Lỗi khi bắt đầu chat:', error);
      // Fallback: tạo chat ID giả
      setChatId(Date.now());
    }
  };
  
  const fetchHumanMessages = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/chat/${id}/messages`);
      setHumanMessages(response.data.data || []);
      setTimeout(() => scrollToBottom(humanMessagesEndRef), 100);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendHumanMessage = async () => {
    if (!humanInput.trim() || !chatId) return;
    
    setHumanLoading(true);
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`/chat/${chatId}/send`, {
        message: humanInput
      });
      
      setHumanInput('');
      fetchHumanMessages(chatId);
    } catch (error) {
      console.error('Lỗi khi gửi tin nhắn:', error);
      // Fallback: thêm tin nhắn local
      const userMessage: ChatMessage = {
        id: Date.now(),
        sender_id: 1,
        message: humanInput,
        created_at: new Date().toISOString(),
        sender: { id: 1, name: 'You' }
      };
      setHumanMessages(prev => [...prev, userMessage]);
      setHumanInput('');
      setTimeout(() => scrollToBottom(humanMessagesEndRef), 100);
    } finally {
      setHumanLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 1 && !chatId) {
      startHumanChat();
    }
  }, [activeTab]);
  
  useEffect(() => {
    if (chatId && activeTab === 1) {
      const interval = setInterval(() => {
        fetchHumanMessages(chatId);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [chatId, activeTab]);

  const renderMessage = (msg: Message) => (
    <Box key={msg.id} sx={{ display: 'flex', justifyContent: msg.type === 'user' ? 'flex-end' : 'flex-start', mb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start', maxWidth: '80%' }}>
        {msg.type !== 'user' && (
          <Avatar sx={{ mr: 1, width: 32, height: 32 }}>
            {msg.type === 'bot' ? <RobotIcon /> : <AdminIcon />}
          </Avatar>
        )}
        <Paper sx={{
          p: 1,
          backgroundColor: msg.type === 'user' ? '#1976d2' : '#f5f5f5',
          color: msg.type === 'user' ? '#fff' : '#000'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              whiteSpace: 'pre-line',
              '& a': {
                color: msg.type === 'user' ? '#fff' : '#1976d2',
                textDecoration: 'underline'
              }
            }}
            dangerouslySetInnerHTML={{
              __html: msg.message.replace(
                /(https?:\/\/[^\s]+)/g, 
                '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>'
              )
            }}
          />
          <Typography variant="caption" sx={{ opacity: 0.7, fontSize: 10 }}>
            {new Date(msg.timestamp).toLocaleTimeString('vi-VN')}
          </Typography>
        </Paper>
        {msg.type === 'user' && (
          <Avatar sx={{ ml: 1, width: 32, height: 32 }}>
            <UserIcon />
          </Avatar>
        )}
      </Box>
    </Box>
  );

  const renderHumanMessage = (msg: ChatMessage, currentUserId: number) => {
    const isCurrentUser = msg.sender_id === currentUserId;
    console.log('Message:', msg.message, 'Sender ID:', msg.sender_id, 'Current User ID:', currentUserId, 'Is Current User:', isCurrentUser);
    
    return (
      <Box key={msg.id} sx={{ 
        display: 'flex', 
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', 
        mb: 1 
      }}>
        <Box sx={{
          maxWidth: '70%',
          padding: '8px 12px',
          borderRadius: 2,
          backgroundColor: isCurrentUser ? '#1976d2' : '#f0f0f0',
          color: isCurrentUser ? '#fff' : '#000'
        }}>
          <Typography variant="body2">{msg.message}</Typography>
          <Typography variant="caption" sx={{ 
            fontSize: 10, 
            opacity: 0.7, 
            display: 'block',
            mt: 0.5
          }}>
            {new Date(msg.created_at).toLocaleTimeString('vi-VN')}
          </Typography>
        </Box>
      </Box>
    );
  };

  return (
    <>
      <Fab
        color="primary"
        sx={{ position: 'fixed', right: 24, bottom: 24 }}
        onClick={() => setVisible(!visible)}
      >
        <MessageIcon />
      </Fab>
      
      {visible && (
        <Card sx={{
          position: 'fixed',
          right: 24,
          bottom: 80,
          width: 400,
          height: 500,
          zIndex: 1000,
          boxShadow: 3
        }}>
          <CardContent sx={{ p: 0, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, borderBottom: 1, borderColor: 'divider' }}>
              <Typography variant="h6">Trợ lý TechStore</Typography>
              <IconButton onClick={() => setVisible(false)}>
                <CloseIcon />
              </IconButton>
            </Box>
            
            <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tab label="🤖 AI Chat" />
              <Tab label="👨💼 Chat Admin" />
            </Tabs>
            
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 1 }}>
              {activeTab === 0 && (
                <>
                  <Box sx={{ 
                    flex: 1, 
                    overflowY: 'scroll', 
                    mb: 1,
                    maxHeight: '300px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#888 #f1f1f1',
                    '&::-webkit-scrollbar': {
                      width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555',
                    },
                  }}>
                    {aiMessages.map(renderMessage)}
                    {aiLoading && (
                      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        AI đang suy nghĩ...
                      </Typography>
                    )}
                    <div ref={aiMessagesEndRef} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      maxRows={2}
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value)}
                      placeholder="Hỏi về sản phẩm, đơn hàng..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendAIMessage();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={sendAIMessage}
                      disabled={aiLoading}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </>
              )}
              
              {activeTab === 1 && (
                <>
                  <Box sx={{ 
                    flex: 1, 
                    overflowY: 'scroll', 
                    mb: 1,
                    maxHeight: '300px',
                    scrollbarWidth: 'thin',
                    scrollbarColor: '#888 #f1f1f1',
                    '&::-webkit-scrollbar': {
                      width: '10px',
                    },
                    '&::-webkit-scrollbar-track': {
                      background: '#f1f1f1',
                      borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      background: '#888',
                      borderRadius: '5px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      background: '#555',
                    },
                  }}>
                    {humanMessages.map(msg => {
                      const user = JSON.parse(localStorage.getItem('user') || '{}');
                      const currentUserId = user.id || 1;
                      return renderHumanMessage(msg, currentUserId);
                    })}
                    {humanLoading && (
                      <Typography variant="body2" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                        Đang gửi...
                      </Typography>
                    )}
                    <div ref={humanMessagesEndRef} />
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      maxRows={2}
                      value={humanInput}
                      onChange={(e) => setHumanInput(e.target.value)}
                      placeholder="Nhắn tin với admin..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          sendHumanMessage();
                        }
                      }}
                    />
                    <Button
                      variant="contained"
                      onClick={sendHumanMessage}
                      disabled={humanLoading}
                      sx={{ minWidth: 'auto', px: 1 }}
                    >
                      <SendIcon />
                    </Button>
                  </Box>
                </>
              )}
            </Box>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ChatBot;