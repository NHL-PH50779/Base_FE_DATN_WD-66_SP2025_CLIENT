import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  Divider,
  Paper,
  Snackbar,
  Alert
} from "@mui/material";

export default function PasswordReset() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateEmail = (email: string) => {
    const re =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\\.,;:\s@"]+\.)+[^<>()[\]\\.,;:\s@"]{2,})$/i;
    return re.test(String(email).toLowerCase());
  };

  const handleResetPassword = () => {
    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    showSnackbar(`Password reset link sent to ${email}`, 'success');
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 4,
          borderRadius: 4,
          backgroundColor: "#fff",
        }}
      >
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Password Reset
        </Typography>
        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={3}
        >
          We will help you reset your password
        </Typography>

        <TextField
          fullWidth
          label="Email Address"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={!!error}
          helperText={error}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleResetPassword}
          sx={{
            mb: 3,
            backgroundColor: "#1e3a8a", // indigo-900
            "&:hover": {
              backgroundColor: "#1e40af", // indigo-800
            },
          }}
        >
          Reset Password
        </Button>

        <Divider sx={{ mb: 2 }} />

        <Typography
          variant="body2"
          align="center"
          color="text.secondary"
          mb={1}
        >
          Remembered your password?
        </Typography>
        <Link
          href="/login"
          underline="hover"
          variant="body2"
          display="block"
          align="center"
        >
          Back to Sign In
        </Link>
      </Paper>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
