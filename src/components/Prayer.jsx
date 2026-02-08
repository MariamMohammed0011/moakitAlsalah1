import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Collapse from "@mui/material/Collapse";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ExploreIcon from "@mui/icons-material/Explore";
import SettingsIcon from "@mui/icons-material/Settings";
import { motion } from "framer-motion";

export default function Prayer({
  title,
  subheader,
  mediaImage,
  avatarLetter,
  rokaa,
  fadl,
  headerGradient,
  avatarBorder,
  time,
  isExpanded,
  onToggleExpand,
  id
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const contentRef = React.useRef(null);
  
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (contentRef.current) {
      const isOverflow = contentRef.current.scrollHeight > 100;
      setLocalIsOverflowing(isOverflow);
    }
  }, [time, id]); // أضف id هنا

  const handleMenuClick = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  
 const handleToggleExpandClick = () => {
  console.log("تم النقر على البطاقة بالـ id:", id); // ← هذا يطبع الـ id
  if (onToggleExpand) {
    onToggleExpand(id);
  }
};


  

  return (
    <Card
      sx={{
        width: 240,
        borderRadius: 4,
        border: "1px solid #a5d6a7",
        background: "#f1f8f4",
        boxShadow: 4,
        display: "flex",
        flexDirection: "column"
      }}
    >
      <CardHeader
        sx={{
          px: 1,
          py: 1,
          background: headerGradient,
          color: "white",
          "& .MuiCardHeader-content": { marginInline: 1 },
          "& .MuiCardHeader-title": { fontWeight: "bold", fontSize: "1.1rem" },
          "& .MuiCardHeader-subheader": { color: "#e3f2fd", fontSize: "0.85rem", marginTop: "1px" }
        }}
        avatar={
          <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}>
            <Avatar
              sx={{
                backgroundImage: headerGradient,
                border: `3px solid ${avatarBorder}`,
                fontWeight: "bold",
                boxShadow: "0 0 12px rgba(0,0,0,0.25)"
              }}
            >
              {avatarLetter}
            </Avatar>
          </motion.div>
        }
        action={
          <>
            <IconButton onClick={handleMenuClick} sx={{ color: "white" }}>
              <MoreVertIcon />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><LocationOnIcon fontSize="small" /></ListItemIcon>
                <ListItemText>تغيير المدينة</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><NotificationsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>تفعيل التنبيه</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><ExploreIcon fontSize="small" /></ListItemIcon>
                <ListItemText>اتجاه القبلة</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleMenuClose}>
                <ListItemIcon><SettingsIcon fontSize="small" /></ListItemIcon>
                <ListItemText>الإعدادات</ListItemText>
              </MenuItem>
            </Menu>
          </>
        }
        title={title}
        subheader={subheader}
      />

      <CardMedia component="img" height="140" image={mediaImage} alt={title} sx={{ objectFit: "cover" }} />

      <Box sx={{ position: "relative" }}>
        <CardContent sx={{
  flexGrow: 1,
  
  overflow: "hidden",
  position: "relative",
  
    "&::after": !isExpanded ? {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
      height: "40px",
      background: "linear-gradient(transparent, #f1f8f4)",
    } : {}
  }}
>
  <Typography variant="body2" sx={{ color: "text.secondary", mb: 1 }}>وقت {title}</Typography>
  <Typography variant="body1" sx={{ color: "text.primary" }}>{time}</Typography>
</CardContent>


      </Box>

      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites" sx={{ color: '#a220f0' }}>
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
        <IconButton
          aria-label="show more"
          sx={{
            marginLeft: "auto",
            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.3s"
          }}
          onClick={handleToggleExpandClick} // ✅ يستخدم نفس الدالة
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>

      {/* Collapse واحد فقط! */}
      <Collapse in={isExpanded} timeout="auto" unmountOnExit >
        <CardContent>
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#0d47a1", mb: 1 }}>
            عدد الركعات
          </Typography>
          <Typography sx={{ mb: 2, lineHeight: 1.8 }}>
            {title} تتكوّن من:<br />
            {rokaa}
          </Typography>
          <hr style={{ border: "none", borderTop: "1px solid #eee", margin: "12px 0" }} />
          <Typography variant="h6" fontWeight="bold" sx={{ color: "#2e7d32", mb: 1 }}>
            فضل {title}
          </Typography>
          <Typography sx={{ lineHeight: 1.8 }}>{fadl}</Typography>
        </CardContent>
      </Collapse>
    </Card>
  );
}