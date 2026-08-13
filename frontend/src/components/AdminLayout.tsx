import { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Typography,
  alpha,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import CategoryIcon from '@mui/icons-material/Category';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import LanguageIcon from '@mui/icons-material/Language';
import { useAuth } from '../context/AuthContext';
import { BRAND } from '../theme';
import Logo from './Logo';

const DRAWER_WIDTH = 248;

const navItems = [
  { label: 'Panel', to: '/admin/dashboard', icon: <DashboardIcon /> },
  { label: 'Yazılar', to: '/admin/posts', icon: <ArticleIcon /> },
  { label: 'Yeni Yazı', to: '/admin/posts/new', icon: <AddIcon /> },
  { label: 'Kategoriler', to: '/admin/categories', icon: <CategoryIcon /> },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <Box>
      <Toolbar sx={{ px: 2.5 }}>
        <Logo size="small" />
      </Toolbar>
      <Divider />
      <List sx={{ pt: 1.5 }}>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={RouterLink}
            to={item.to}
            selected={location.pathname === item.to}
          >
            <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>{item.icon}</ListItemIcon>
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: '0.94rem' }}
            />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          ml: { sm: `${DRAWER_WIDTH}px` },
          bgcolor: alpha('#080b14', 0.75),
          backdropFilter: 'blur(16px)',
          borderBottom: `1px solid ${BRAND.border}`,
        }}
      >
        <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto', ml: 1 }}>
            Yönetim Paneli
          </Typography>

          <IconButton component={RouterLink} to="/" title="Siteyi görüntüle" size="small">
            <LanguageIcon fontSize="small" />
          </IconButton>

          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)} size="small">
            <Avatar
              sx={{
                width: 32,
                height: 32,
                fontSize: '0.85rem',
                fontWeight: 700,
                background: `linear-gradient(135deg, ${BRAND.blue}, ${BRAND.orange})`,
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{
              sx: {
                mt: 1,
                border: `1px solid ${BRAND.border}`,
                bgcolor: alpha('#111827', 0.95),
                backdropFilter: 'blur(12px)',
              },
            }}
          >
            <MenuItem disabled sx={{ opacity: '0.7 !important' }}>
              {user?.email}
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Çıkış Yap
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            borderRight: `1px solid ${BRAND.border}`,
            bgcolor: alpha('#0b1020', 0.75),
            backdropFilter: 'blur(12px)',
          },
          display: { xs: 'none', sm: 'block' },
        }}
        open
      >
        {drawer}
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 4 },
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          minHeight: '100vh',
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}
