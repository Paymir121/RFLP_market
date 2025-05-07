import React from 'react';
import { Link } from 'react-router-dom';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Container,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Tooltip,
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    console.log("2");
    const { user, logout } = useAuth();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const open = Boolean(anchorEl);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const navItems = [
        { label: 'Все продукты', path: '/products' },
        { label: 'API', path: '/products/api' },
        { label: 'Оборудование', path: '/products/equipment' },
        { label: 'Вспомогательные вещества', path: '/products/auxiliary' },
        { label: 'Радиофармпрепарат', path: '/products/RFLP' },
    ];

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar>

                    {/* Иконка меню на маленьких экранах */}
                    <Box sx={{ display: { xs: 'flex', md: 'none' }, mr: 2 }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer
                            anchor="left"
                            open={drawerOpen}
                            onClose={toggleDrawer(false)}
                        >
                            <Box
                                sx={{ width: 250 }}
                                role="presentation"
                                onClick={toggleDrawer(false)}
                                onKeyDown={toggleDrawer(false)}
                            >
                                <List>
                                    {navItems.map((item) => (
                                        <ListItem button component={Link} to={item.path} key={item.label}>
                                            <ListItemText primary={item.label} />
                                        </ListItem>
                                    ))}
                                    {!user && (
                                        <>
                                            <ListItem button component={Link} to="/login">
                                                <ListItemText primary="Войти" />
                                            </ListItem>
                                            <ListItem button component={Link} to="/register">
                                                <ListItemText primary="Регистрация" />
                                            </ListItem>
                                        </>
                                    )}
                                    {user && (

                                        <>
                                            <ListItem button component={Link} to="/create-product">
                                                <ListItemText primary="Создать продукт" />
                                            </ListItem>
                                            <ListItem button component={Link} to="/profile">
                                                <ListItemText primary="Профиль" />
                                            </ListItem>
                                            <ListItem button onClick={logout}>
                                                <ListItemText primary="Выйти" />
                                            </ListItem>
                                        </>
                                    )}
                                </List>
                            </Box>
                        </Drawer>
                    </Box>

                    {/* Лого */}
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{
                            flexGrow: 1,
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        <Link to="/" style={{ display: 'flex', alignItems: 'center', color: 'inherit', textDecoration: 'none' }}>
                            <svg
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                                style={{ marginRight: 8 }}
                            >
                                <path
                                    d="M12 10a2 2 0 012 2 2 2 0 01-2 2 2 2 0 01-2-2 2 2 0 012-2m0-8a10 10 0 0110 10c0 3.22-1.13 5.86-3.03 7.75l-2.29-2.28A7.5 7.5 0 0019.5 12a7.5 7.5 0 00-15 0 7.5 7.5 0 002.82 5.47l-2.29 2.28C3.13 17.86 2 15.22 2 12A10 10 0 0112 2m0 4a6 6 0 016 6c0 1.53-.56 2.8-1.5 3.69l-1.18-1.18A3.5 3.5 0 0015.5 12a3.5 3.5 0 00-7 0 3.5 3.5 0 001.18 2.51l-1.18 1.18C6.56 14.8 6 13.53 6 12a6 6 0 016-6z"
                                />
                            </svg>
                            Project R
                        </Link>
                    </Typography>

                    {/* Кнопки на больших экранах */}
                    <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
                        {navItems.map((item) => (
                            <Button key={item.label} color="inherit" component={Link} to={item.path}>
                                {item.label}
                            </Button>
                        ))}
                        {user ? (
                            <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                                <Button color="inherit" component={Link} to="/create-product">
                                    Создать продукт
                                </Button>
                                <Tooltip title="Account settings">
                                    <IconButton
                                        onClick={handleMenu}
                                        size="small"
                                        sx={{ ml: 2 }}
                                        aria-controls={open ? 'account-menu' : undefined}
                                        aria-haspopup="true"
                                        aria-expanded={open ? 'true' : undefined}
                                    >
                                        <Avatar sx={{ width: 32, height: 32 }}>
                                            {user.email.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </IconButton>
                                </Tooltip>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: 'visible',
                                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                            mt: 1.5,
                                            '& .MuiAvatar-root': {
                                                width: 32,
                                                height: 32,
                                                ml: -0.5,
                                                mr: 1,
                                            },
                                            '&:before': {
                                                content: '""',
                                                display: 'block',
                                                position: 'absolute',
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: 'background.paper',
                                                transform: 'translateY(-50%) rotate(45deg)',
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                    transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                    anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                                >
                                    <MenuItem component={Link} to="/profile">
                                        Профиль
                                    </MenuItem>
                                    <MenuItem onClick={() => { handleClose(); logout(); }}>
                                        Выйти
                                    </MenuItem>

                                </Menu>
                            </Box>
                        ) : (
                            <>
                                <Button color="inherit" component={Link} to="/login">
                                    Войти
                                </Button>
                                <Button color="inherit" component={Link} to="/register">
                                    Регистрация
                                </Button>
                            </>
                        )}
                    </Box>

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Navbar;
