import React, { useContext, useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
    Container,
    Typography,
    Box,
    Avatar,
    Paper,
    Grid,
    Button,
    TextField,
    Divider,
    CircularProgress,
    Alert
} from '@mui/material';
import { deepPurple } from '@mui/material/colors';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import LogoutIcon from '@mui/icons-material/Logout';

const ProfilePage = () => {
    const { user, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        first_name: '',
        last_name: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Заполняем форму данными пользователя при загрузке
    useEffect(() => {
        if (user) {
            setFormData({
                email: user.email || '',
                first_name: user.first_name || '',
                last_name: user.last_name || ''
            });
        }
    }, [user]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            await updateProfile(formData); // вызываем метод из контекста
            setSuccess('Profile updated successfully!');
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) {
        return (
            <Container maxWidth="sm" sx={{ mt: 4 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <Box display="flex" flexDirection="column" alignItems="center">
                            <Avatar
                                sx={{
                                    width: 120,
                                    height: 120,
                                    bgcolor: deepPurple[500],
                                    fontSize: '3rem',
                                    mb: 2
                                }}
                            >
                                {user.email.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="h5" component="h1" gutterBottom>
                                {user.first_name || 'User'} {user.last_name || ''}
                            </Typography>
                            <Button
                                variant="outlined"
                                color="error"
                                startIcon={<LogoutIcon />}
                                onClick={logout}
                                sx={{ mt: 2 }}
                            >
                                Logout
                            </Button>
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Box sx={{ mb: 3 }}>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" component="h2" gutterBottom>
                                    Profile Information
                                </Typography>
                                {isEditing ? (
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
                                        onClick={handleSave}
                                        disabled={loading}
                                    >
                                        Save Changes
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outlined"
                                        startIcon={<EditIcon />}
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                )}
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            {success && (
                                <Alert severity="success" sx={{ mb: 2 }}>
                                    {success}
                                </Alert>
                            )}

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="First Name"
                                        name="first_name"
                                        value={formData.first_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Name"
                                        name="last_name"
                                        value={formData.last_name}
                                        onChange={handleInputChange}
                                        disabled={!isEditing}
                                        variant={isEditing ? "outlined" : "filled"}
                                    />
                                </Grid>
                            </Grid>
                        </Box>

                        <Box sx={{ mt: 4 }}>
                            <Typography variant="h6" component="h2" gutterBottom>
                                Account Details
                            </Typography>
                            <Divider sx={{ my: 2 }} />
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Account Created"
                                        value={new Date(user.date_joined).toLocaleDateString()}
                                        disabled
                                        variant="filled"
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Last Login"
                                        value={user.last_login ? new Date(user.last_login).toLocaleString() : 'Never'}
                                        disabled
                                        variant="filled"
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    );
};

export default ProfilePage;