import React, { useState, useEffect } from 'react';
import { commentService, type Comment } from '../services/comment.service';

interface Props {
  productId: number;
}

const ProductComments: React.FC<Props> = ({ productId }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    loadComments();
    const interval = setInterval(loadComments, 5000);
    return () => clearInterval(interval);
  }, [productId]);

  const loadComments = async () => {
    try {
      const commentsData = await commentService.getComments(productId);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading comments:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setMessage('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!newComment.trim()) return;

    setLoading(true);
    try {
      await commentService.addComment(productId, newComment.trim());
      setNewComment('');
      setMessage('Bình luận đã gửi, chờ duyệt!');
      setTimeout(() => setMessage(''), 3000);
      // Reload comments after a short delay
      setTimeout(loadComments, 1000);
    } catch (error: any) {
      console.error('Error details:', error.response?.data);
      let errorMsg = 'Có lỗi xảy ra khi gửi bình luận';
      
      if (error.message === 'Vui lòng đăng nhập để bình luận') {
        errorMsg = error.message;
      } else if (error.response?.status === 422) {
        errorMsg = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.response?.status === 401) {
        errorMsg = 'Vui lòng đăng nhập để bình luận';
      }
      
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Bình luận ({comments.length})</h3>
      
      {user ? (
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận của bạn về sản phẩm..."
            style={{ 
              width: '100%', 
              minHeight: '80px', 
              padding: '10px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button 
              type="submit" 
              disabled={loading || !newComment.trim()}
              style={{
                padding: '8px 16px',
                backgroundColor: loading ? '#ccc' : '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi bình luận'}
            </button>
            
            {message && (
              <span style={{ 
                color: message.includes('lỗi') ? 'red' : 'green',
                fontSize: '14px'
              }}>
                {message}
              </span>
            )}
          </div>
        </form>
      ) : (
        <div style={{ 
          marginBottom: '20px', 
          padding: '15px', 
          backgroundColor: '#f0f8ff', 
          borderRadius: '5px',
          textAlign: 'center'
        }}>
          <p>Vui lòng <a href="/login" style={{ color: '#007bff' }}>đăng nhập</a> để bình luận</p>
        </div>
      )}

      <div>
        {comments.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
            Chưa có bình luận nào
          </p>
        ) : (
          comments.map(comment => (
            <div key={comment.id} style={{ 
              padding: '15px', 
              border: '1px solid #eee', 
              borderRadius: '5px', 
              marginBottom: '15px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ fontWeight: 'bold' }}>
                  {comment.user.name}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  {new Date(comment.created_at).toLocaleDateString('vi-VN', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div style={{ lineHeight: '1.5', color: '#333' }}>
                {comment.content}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductComments;