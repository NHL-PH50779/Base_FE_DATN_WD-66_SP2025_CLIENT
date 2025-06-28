import React, { useState } from 'react';
import { commentService } from '../services/comment.service';

interface Props {
  productId: number;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<Props> = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  const user = JSON.parse(localStorage.getItem('user') || 'null');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setMessage('Vui lòng đăng nhập để đánh giá');
      return;
    }
    
    if (rating === 0) {
      setMessage('Vui lòng chọn số sao đánh giá');
      return;
    }
    
    if (!content.trim()) {
      setMessage('Vui lòng nhập nội dung đánh giá');
      return;
    }

    setLoading(true);
    try {
      await commentService.addReview({
        product_id: productId,
        content: content.trim(),
        rating: rating
      });
      
      setRating(0);
      setContent('');
      setMessage('Đánh giá đã được gửi thành công!');
      
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error: any) {
      console.error('Error submitting review:', error);
      let errorMsg = 'Có lỗi xảy ra khi gửi đánh giá';
      
      if (error.response?.status === 401) {
        errorMsg = 'Vui lòng đăng nhập để đánh giá';
      } else if (error.response?.status === 422) {
        errorMsg = 'Thông tin không hợp lệ. Vui lòng kiểm tra lại.';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      setMessage(errorMsg);
      setTimeout(() => setMessage(''), 5000);
    } finally {
      setLoading(false);
    }
  };

  const renderStarRating = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type="button"
          onClick={() => setRating(i)}
          onMouseEnter={() => setHoveredRating(i)}
          onMouseLeave={() => setHoveredRating(0)}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '24px',
            color: i <= (hoveredRating || rating) ? '#ffd700' : '#ddd',
            cursor: 'pointer',
            padding: '4px',
            transition: 'color 0.2s ease'
          }}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 1: return 'Rất tệ';
      case 2: return 'Tệ';
      case 3: return 'Bình thường';
      case 4: return 'Tốt';
      case 5: return 'Rất tốt';
      default: return '';
    }
  };

  if (!user) {
    return (
      <div style={{ 
        padding: '20px', 
        border: '1px solid #ddd', 
        borderRadius: '8px', 
        marginBottom: '20px',
        backgroundColor: '#f0f8ff',
        textAlign: 'center'
      }}>
        <h4>Đánh giá sản phẩm</h4>
        <p>Vui lòng <a href="/login" style={{ color: '#007bff' }}>đăng nhập</a> để đánh giá sản phẩm</p>
      </div>
    );
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      marginBottom: '20px',
      backgroundColor: '#fff'
    }}>
      <h4>Đánh giá sản phẩm</h4>
      
      <form onSubmit={handleSubmit}>
        {/* Rating Stars */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Đánh giá của bạn:
          </label>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {renderStarRating()}
            {rating > 0 && (
              <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                {getRatingText(rating)} ({rating}/5 sao)
              </span>
            )}
          </div>
        </div>

        {/* Review Content */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>
            Nội dung đánh giá:
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
            style={{ 
              width: '100%', 
              minHeight: '100px', 
              padding: '12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical',
              fontSize: '14px',
              lineHeight: '1.5'
            }}
            maxLength={1000}
          />
          <div style={{ 
            textAlign: 'right', 
            fontSize: '12px', 
            color: '#666', 
            marginTop: '4px' 
          }}>
            {content.length}/1000 ký tự
          </div>
        </div>

        {/* Submit Button and Message */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <button 
            type="submit" 
            disabled={loading || rating === 0 || !content.trim()}
            style={{
              padding: '10px 20px',
              backgroundColor: loading || rating === 0 || !content.trim() ? '#ccc' : '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading || rating === 0 || !content.trim() ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: 500
            }}
          >
            {loading ? 'Đang gửi...' : 'Gửi đánh giá'}
          </button>
          
          {message && (
            <span style={{ 
              color: message.includes('lỗi') || message.includes('Vui lòng') ? 'red' : 'green',
              fontSize: '14px',
              fontWeight: 500
            }}>
              {message}
            </span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;