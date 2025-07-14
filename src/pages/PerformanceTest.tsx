import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  LinearProgress,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Alert,
  Grid
} from '@mui/material';
import { Speed, Assessment, Refresh, CheckCircle, Error } from '@mui/icons-material';

interface TestResult {
  name: string;
  endpoint?: string;
  url?: string;
  responseTime?: number;
  loadTime?: number;
  status: number | string;
  success: boolean;
  error?: string;
}

const PerformanceTest = () => {
  const [testing, setTesting] = useState(false);
  const [apiResults, setApiResults] = useState<TestResult[]>([]);
  const [resourceResults, setResourceResults] = useState<TestResult[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const testAPI = async (endpoint: string, name: string) => {
    const startTime = performance.now();
    try {
      const response = await fetch(`http://127.0.0.1:8000/api${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      const endTime = performance.now();
      
      return {
        name,
        endpoint,
        responseTime: Math.round(endTime - startTime),
        status: response.status,
        success: response.ok
      };
    } catch (error: any) {
      const endTime = performance.now();
      return {
        name,
        endpoint,
        responseTime: Math.round(endTime - startTime),
        status: 'ERROR',
        success: false,
        error: error.message
      };
    }
  };

  const testResource = async (url: string, name: string) => {
    const startTime = performance.now();
    try {
      const response = await fetch(url, { mode: 'no-cors' });
      const endTime = performance.now();
      
      return {
        name,
        url,
        loadTime: Math.round(endTime - startTime),
        status: response.status || 200,
        success: true
      };
    } catch (error: any) {
      const endTime = performance.now();
      return {
        name,
        url,
        loadTime: Math.round(endTime - startTime),
        status: 'ERROR',
        success: false,
        error: error.message
      };
    }
  };

  const getRating = (time: number) => {
    if (time < 100) return { label: 'Excellent', color: 'success' as const, icon: '🚀' };
    if (time < 300) return { label: 'Good', color: 'success' as const, icon: '⚡' };
    if (time < 500) return { label: 'Average', color: 'warning' as const, icon: '⚠️' };
    if (time < 1000) return { label: 'Slow', color: 'error' as const, icon: '🐌' };
    return { label: 'Very Slow', color: 'error' as const, icon: '💀' };
  };

  const runTests = async () => {
    setTesting(true);
    setApiResults([]);
    setResourceResults([]);
    setSummary(null);

    // API Tests
    const apiEndpoints = [
      { path: '/products', name: 'Products List' },
      { path: '/categories', name: 'Categories' },
      { path: '/brands', name: 'Brands' },
      { path: '/news', name: 'News' },
      { path: '/comments', name: 'Comments' },
      { path: '/test', name: 'Health Check' }
    ];

    const apiTestResults = [];
    for (const endpoint of apiEndpoints) {
      const result = await testAPI(endpoint.path, endpoint.name);
      apiTestResults.push(result);
      setApiResults([...apiTestResults]);
    }

    // Resource Tests
    const resources = [
      { url: 'http://localhost:5174/', name: 'Client App' },
      { url: 'http://localhost:5173/', name: 'Admin Panel' },
      { url: 'http://127.0.0.1:8000/api/test', name: 'Backend API' }
    ];

    const resourceTestResults = [];
    for (const resource of resources) {
      const result = await testResource(resource.url, resource.name);
      resourceTestResults.push(result);
      setResourceResults([...resourceTestResults]);
    }

    // Generate Summary
    const apiTimes = apiTestResults.filter(r => r.success).map(r => r.responseTime || 0);
    const resourceTimes = resourceTestResults.filter(r => r.success).map(r => r.loadTime || 0);
    
    setSummary({
      api: {
        average: apiTimes.length > 0 ? Math.round(apiTimes.reduce((a, b) => a + b, 0) / apiTimes.length) : 0,
        fastest: apiTimes.length > 0 ? Math.min(...apiTimes) : 0,
        slowest: apiTimes.length > 0 ? Math.max(...apiTimes) : 0,
        successRate: `${apiTestResults.filter(r => r.success).length}/${apiTestResults.length}`
      },
      resources: {
        average: resourceTimes.length > 0 ? Math.round(resourceTimes.reduce((a, b) => a + b, 0) / resourceTimes.length) : 0,
        successRate: `${resourceTestResults.filter(r => r.success).length}/${resourceTestResults.length}`
      }
    });

    setTesting(false);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Speed sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
        <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
          Website Performance Test
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
          Kiểm tra tốc độ load trang và API response time
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          startIcon={testing ? <LinearProgress /> : <Assessment />}
          onClick={runTests}
          disabled={testing}
          sx={{ px: 4, py: 1.5 }}
        >
          {testing ? 'Đang kiểm tra...' : 'Bắt đầu kiểm tra'}
        </Button>
      </Box>

      {testing && (
        <Box sx={{ mb: 4 }}>
          <LinearProgress />
          <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
            Đang thực hiện các bài test...
          </Typography>
        </Box>
      )}

      {summary && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  🔗 API Performance
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Average:</Typography>
                  <Chip 
                    label={`${summary.api.average}ms`}
                    color={getRating(summary.api.average).color}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Fastest:</Typography>
                  <Typography>{summary.api.fastest}ms</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Slowest:</Typography>
                  <Typography>{summary.api.slowest}ms</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Success Rate:</Typography>
                  <Typography>{summary.api.successRate}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  🌐 Resource Loading
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography>Average:</Typography>
                  <Chip 
                    label={`${summary.resources.average}ms`}
                    color={getRating(summary.resources.average).color}
                    size="small"
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography>Success Rate:</Typography>
                  <Typography>{summary.resources.successRate}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}

      {apiResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🔗 API Response Times
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>API Endpoint</TableCell>
                    <TableCell>Response Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {apiResults.map((result, index) => {
                    const rating = getRating(result.responseTime || 0);
                    return (
                      <TableRow key={index}>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.responseTime}ms</TableCell>
                        <TableCell>
                          {result.success ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Error color="error" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${rating.icon} ${rating.label}`}
                            color={rating.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {resourceResults.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              🌐 Resource Load Times
            </Typography>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Resource</TableCell>
                    <TableCell>Load Time</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Rating</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {resourceResults.map((result, index) => {
                    const rating = getRating(result.loadTime || 0);
                    return (
                      <TableRow key={index}>
                        <TableCell>{result.name}</TableCell>
                        <TableCell>{result.loadTime}ms</TableCell>
                        <TableCell>
                          {result.success ? (
                            <CheckCircle color="success" />
                          ) : (
                            <Error color="error" />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${rating.icon} ${rating.label}`}
                            color={rating.color}
                            size="small"
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      )}

      {summary && (
        <Alert severity="info" sx={{ mt: 3 }}>
          <Typography variant="h6" sx={{ mb: 1 }}>💡 Recommendations:</Typography>
          {summary.api.average > 500 && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              ⚠️ API response time is slow. Consider database optimization, caching, or indexing.
            </Typography>
          )}
          {summary.resources.average > 1000 && (
            <Typography variant="body2" sx={{ mb: 1 }}>
              ⚠️ Page load time is slow. Consider code splitting, image optimization, or bundle size reduction.
            </Typography>
          )}
          {summary.api.average < 200 && summary.resources.average < 800 && (
            <Typography variant="body2">
              🎉 Great performance! Your app is fast and responsive.
            </Typography>
          )}
        </Alert>
      )}
    </Container>
  );
};

export default PerformanceTest;