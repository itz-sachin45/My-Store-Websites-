import React from 'react';
import DevicesIcon from '@mui/icons-material/Devices';
import ChairIcon from '@mui/icons-material/Chair';
import CheckroomIcon from '@mui/icons-material/Checkroom';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import KitchenIcon from '@mui/icons-material/Kitchen';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import HeadphonesIcon from '@mui/icons-material/Headphones';
import LaptopMacIcon from '@mui/icons-material/LaptopMac';
import WatchIcon from '@mui/icons-material/Watch';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import CategoryIconDefault from '@mui/icons-material/Category';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import HomeWorkIcon from '@mui/icons-material/HomeWork';

export const AVAILABLE_CATEGORY_ICONS = [
  { key: 'Devices', label: 'Devices / Electronics', Icon: DevicesIcon },
  { key: 'Chair', label: 'Chair / Furniture', Icon: ChairIcon },
  { key: 'Checkroom', label: 'Checkroom / Apparel', Icon: CheckroomIcon },
  { key: 'FitnessCenter', label: 'Fitness / Gym', Icon: FitnessCenterIcon },
  { key: 'Kitchen', label: 'Kitchen / Dining', Icon: KitchenIcon },
  { key: 'SportsEsports', label: 'Gaming / Esports', Icon: SportsEsportsIcon },
  { key: 'MenuBook', label: 'Books / Education', Icon: MenuBookIcon },
  { key: 'AutoAwesome', label: 'Beauty / Specialty', Icon: AutoAwesomeIcon },
  { key: 'Headphones', label: 'Headphones / Audio', Icon: HeadphonesIcon },
  { key: 'LaptopMac', label: 'Laptop / Tech', Icon: LaptopMacIcon },
  { key: 'Watch', label: 'Watch / Accessories', Icon: WatchIcon },
  { key: 'CameraAlt', label: 'Camera / Photo', Icon: CameraAltIcon },
  { key: 'ShoppingBag', label: 'Shopping / Bag', Icon: ShoppingBagIcon },
  { key: 'HomeWork', label: 'Home / Living', Icon: HomeWorkIcon },
  { key: 'Category', label: 'General Category', Icon: CategoryIconDefault },
];

export default function CategoryIcon({ iconKey, sx = {}, ...props }) {
  const match = AVAILABLE_CATEGORY_ICONS.find(
    (item) => item.key.toLowerCase() === (iconKey || '').toLowerCase()
  );

  const IconComponent = match ? match.Icon : CategoryIconDefault;

  return <IconComponent sx={{ fontSize: '1.25rem', ...sx }} {...props} />;
}
