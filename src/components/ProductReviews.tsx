import React, { useState, useEffect } from 'react';
import { commentService, type Review } from '../services/comment.service';

interface Props {
  productId: number;
}

const ProductReviews: React.FC<Props> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingStats, setRatingStats] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadReviews();
    loadRatingStats();
  }, [productId]);

  const loadReviews = async () => {
    try {
      const reviewsData = await commentService.getReviews(productId);
      setReviews(reviewsData);
    } catch (error) {
      console.error('Error loading reviews:', error);
    }
  };

  const loadRatingStats = async () => {
    try {
      const stats = await commentService.getRatingStats(productId);
      setRatingStats(stats);
    } catch (error) {
      console.error('Error loading rating stats:', error);
    }
  };

  const renderStars = (rating: number, size: 'small' | 'medium' | 'large' = 'medium') => {
    const starSize = size === 'small' ? '14px' : size === 'large' ? '20px' : '16px';
    const stars = [];
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          style={{
            color: i <= rating ? '#ffd700' : '#ddd',
            fontSize: starSize,
            marginRight: '2px'
          }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  const renderRatingBar = (star: number, count: number, percentage: number) => (
    <div key={star} style={{ 
      display: 'flex', 
      alignItems: 'center', 
      marginBottom: '8px',
      fontSize: '14px'
    }}>
      <span style={{ minWidth: '40px' }}>{star} sao</span>
      <div style={{ 
        flex: 1, 
        height: '8px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        margin: '0 10px',
        overflow: 'hidden'
      }}>
        <div style={{ 
          height: '100%', 
          width: `${percentage}%`, 
          backgroundColor: '#ffd700',
          transition: 'width 0.3s ease'
        }} />
      </div>
      <span style={{ minWidth: '30px', textAlign: 'right' }}>{count}</span>
    </div>
  );

  if (!ratingStats) {
    return <div>Đang tải...</div>;
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>Đánh giá sản phẩm</h3>
      
      {/* Rating Summary */}
      <div style={{ 
        display: 'flex', 
        gap: '30px', 
        marginBottom: '30px',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#333' }}>
            {ratingStats.average_rating}
          </div>
          <div style={{ marginBottom: '8px' }}>
            {renderStars(Math.round(ratingStats.average_rating), 'large')}
          </div>
          <div style={{ color: '#666', fontSize: '14px' }}>
            {ratingStats.total_reviews} đánh giá
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          {[5, 4, 3, 2, 1].map(star => 
            renderRatingBar(
              star, 
              ratingStats.rating_breakdown[star] || 0,
              ratingStats.percentage_breakdown[star] || 0
            )
          )}
        </div>
      </div>

      {/* Reviews List */}
      <div>
        <h4>Các đánh giá ({reviews.length})</h4>
        
        {reviews.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            color: '#666', 
            fontStyle: 'italic',
            padding: '40px 0'
          }}>
            Chưa có đánh giá nào cho sản phẩm này
          </div>
        ) : (
          <div>
            {reviews.map(review => (
              <div key={review.id} style={{ 
                padding: '20px', 
                border: '1px solid #eee', 
                borderRadius: '8px', 
                marginBottom: '16px',
                backgroundColor: '#fafafa'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start', 
                  marginBottom: '12px' 
                }}>
                  <div>
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                      {review.user.name}
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      {renderStars(review.rating)}
                      <span style={{ marginLeft: '8px', color: '#666', fontSize: '14px' }}>
                        {review.rating}/5 sao
                      </span>
                    </div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>
                    {new Date(review.created_at).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
                
                <div style={{ 
                  lineHeight: '1.6', 
                  color: '#333',
                  padding: '12px',
                  backgroundColor: '#fff',
                  borderRadius: '4px',
                  border: '1px solid #f0f0f0'
                }}>
                  {review.content}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductReviews;