import React, { useState } from 'react';
import ProductComments from './ProductComments';
import ProductReviews from './ProductReviews';
import ReviewForm from './ReviewForm';

interface Props {
  productId: number;
}

const ProductCommentsAndReviews: React.FC<Props> = ({ productId }) => {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments' | 'write-review'>('reviews');
  const [refreshKey, setRefreshKey] = useState(0);

  const handleReviewSubmitted = () => {
    setRefreshKey(prev => prev + 1);
    setActiveTab('reviews');
  };

  const tabStyle = (isActive: boolean) => ({
    padding: '12px 24px',
    backgroundColor: isActive ? '#007bff' : '#f8f9fa',
    color: isActive ? 'white' : '#333',
    border: '1px solid #ddd',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
    transition: 'all 0.3s ease'
  });

  return (
    <div style={{ marginTop: '30px' }}>
      {/* Tab Navigation */}
      <div style={{ 
        display: 'flex', 
        borderBottom: '2px solid #ddd',
        marginBottom: '20px'
      }}>
        <button
          onClick={() => setActiveTab('reviews')}
          style={{
            ...tabStyle(activeTab === 'reviews'),
            borderTopLeftRadius: '8px',
            borderBottomLeftRadius: '8px',
            borderRight: 'none'
          }}
        >
          📊 Đánh giá sản phẩm
        </button>
        <button
          onClick={() => setActiveTab('comments')}
          style={{
            ...tabStyle(activeTab === 'comments'),
            borderRight: 'none'
          }}
        >
          💬 Bình luận
        </button>
        <button
          onClick={() => setActiveTab('write-review')}
          style={{
            ...tabStyle(activeTab === 'write-review'),
            borderTopRightRadius: '8px',
            borderBottomRightRadius: '8px'
          }}
        >
          ✍️ Viết đánh giá
        </button>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'reviews' && (
          <div key={`reviews-${refreshKey}`}>
            <ProductReviews productId={productId} />
          </div>
        )}
        
        {activeTab === 'comments' && (
          <div key={`comments-${refreshKey}`}>
            <ProductComments productId={productId} />
          </div>
        )}
        
        {activeTab === 'write-review' && (
          <ReviewForm 
            productId={productId} 
            onReviewSubmitted={handleReviewSubmitted}
          />
        )}
      </div>
    </div>
  );
};

export default ProductCommentsAndReviews;