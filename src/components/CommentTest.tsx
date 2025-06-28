import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, Space, message } from 'antd';
import { commentService } from '../services/comment.service';

const CommentTest: React.FC = () => {
  const [comments, setComments] = useState<any[]>([]);

  const fetchComments = () => {
    const allComments = JSON.parse(localStorage.getItem('shared_all_comments') || '[]');
    setComments(allComments);
    console.log('Current comments in localStorage:', allComments);
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const addTestComment = async () => {
    // Set fake user for testing
    localStorage.setItem('user', JSON.stringify({
      id: 123,
      name: 'Test User'
    }));

    try {
      await commentService.addComment({
        product_id: 1,
        content: `Test comment ${Date.now()}`,
        rating: 0
      });
      
      message.success('Đã thêm comment test!');
      setTimeout(fetchComments, 1000);
    } catch (error) {
      console.error('Error adding test comment:', error);
    }
  };

  const clearAllComments = () => {
    localStorage.removeItem('shared_all_comments');
    setComments([]);
    message.success('Đã xóa tất cả comments!');
  };

  return (
    <Card title="Comment System Test" style={{ margin: '20px' }}>
      <Space direction="vertical" style={{ width: '100%' }}>
        <Space>
          <Button type="primary" onClick={addTestComment}>
            Thêm Comment Test
          </Button>
          <Button onClick={fetchComments}>
            Refresh
          </Button>
          <Button danger onClick={clearAllComments}>
            Xóa Tất Cả
          </Button>
        </Space>
        
        <Typography.Title level={4}>
          Comments hiện tại: {comments.length}
        </Typography.Title>
        
        {comments.map((comment, index) => (
          <Card key={index} size="small">
            <Typography.Text strong>{comment.user.name}</Typography.Text>
            <br />
            <Typography.Text>{comment.content}</Typography.Text>
            <br />
            <Typography.Text type="secondary">
              Status: {comment.status} | {new Date(comment.created_at).toLocaleString()}
            </Typography.Text>
          </Card>
        ))}
      </Space>
    </Card>
  );
};

export default CommentTest;