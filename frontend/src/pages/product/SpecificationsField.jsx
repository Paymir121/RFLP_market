import React, { useState } from 'react';
import {
    Typography,
    Grid,
    TextField,
    IconButton,
    Box
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

const SpecificationsField = ({ specifications, onChange }) => {
    const [specsList, setSpecsList] = useState(
        Object.keys(specifications).length > 0
            ? Object.entries(specifications).map(([key, value], index) => ({
                id: index + 1,
                key,
                value
            }))
            : [{ id: 1, key: '', value: '' }]
    );

    const handleChange = (id, field, value) => {
        const updated = specsList.map(item =>
            item.id === id ? { ...item, [field]: value } : item
        );
        setSpecsList(updated);

        const specsObj = {};
        updated.forEach(item => {
            if (item.key && item.value) specsObj[item.key] = item.value;
        });
        onChange(specsObj);
    };

    const addField = () => {
        setSpecsList([...specsList, {
            id: Math.max(0, ...specsList.map(i => i.id)) + 1,
            key: '',
            value: ''
        }]);
    };

    const removeField = (id) => {
        if (specsList.length <= 1) return;
        const updated = specsList.filter(item => item.id !== id);
        setSpecsList(updated);

        const specsObj = {};
        updated.forEach(item => {
            if (item.key && item.value) specsObj[item.key] = item.value;
        });
        onChange(specsObj);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Характеристики
            </Typography>

            {specsList.map((spec, index) => (
                <Grid container spacing={2} key={spec.id} alignItems="center" sx={{ mb: 2 }}>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Название"
                            value={spec.key}
                            onChange={(e) => handleChange(spec.id, 'key', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            fullWidth
                            label="Значение"
                            value={spec.value}
                            onChange={(e) => handleChange(spec.id, 'value', e.target.value)}
                        />
                    </Grid>
                    <Grid item xs={2}>
                        {specsList.length > 1 && (
                            <IconButton onClick={() => removeField(spec.id)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        )}
                        {index === specsList.length - 1 && (
                            <IconButton onClick={addField} color="primary">
                                <AddIcon />
                            </IconButton>
                        )}
                    </Grid>
                </Grid>
            ))}
        </Box>
    );
};

export default SpecificationsField;