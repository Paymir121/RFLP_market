import React from 'react';
import {
    Button,
    List,
    ListItem,
    ListItemAvatar,
    Avatar,
    ListItemText,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';

const ImageUploader = ({ images, onChange }) => {
    const handleChange = (e) => {
        const files = Array.from(e.target.files);
        onChange([...images, ...files]);
    };

    const removeImage = (index) => {
        const updated = [...images];
        updated.splice(index, 1);
        onChange(updated);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Фотографии
            </Typography>

            {images.length > 0 && (
                <Box sx={{ mb: 2 }}>
                    <List dense>
                        {images.map((image, index) => (
                            <ListItem
                                key={index}
                                secondaryAction={
                                    <IconButton
                                        edge="end"
                                        onClick={() => removeImage(index)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                }
                            >
                                <ListItemAvatar>
                                    <Avatar>
                                        <ImageIcon />
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary={image.name}
                                    secondary={`${(image.size / 1024).toFixed(2)} KB`}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Box>
            )}

            <Button
                variant="contained"
                component="label"
                startIcon={<AddIcon />}
            >
                Добавить Фотографию
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleChange}
                    hidden
                />
            </Button>
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                Вы можете добавить множество Фотографий
            </Typography>
        </Box>
    );
};

export default ImageUploader;