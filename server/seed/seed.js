const dotenv = require('dotenv');
dotenv.config({ path: require('path').join(__dirname, '..', '.env') });

const connectDB = require('../config/db');
const User = require('../models/User');
const Category = require('../models/Category');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const Order = require('../models/Order');
const Review = require('../models/Review');
const DeliveryReward = require('../models/DeliveryReward');

const asset = (file) => `/demo-products/${file}`;

const productAssetMap = {
  'House Wires': 'house-wires.svg',
  'Copper Flexible Wires': 'flexible-wires.svg',
  'Multicore Wires': 'multicore-wires.svg',
  'Armoured Cables': 'armoured-cables.svg',
  'Coaxial Cables': 'coaxial-cables.svg',
  'Control Cables': 'control-cables.svg',
  'LED Bulbs': 'led-bulbs.svg',
  'Flood Lights': 'flood-lights.svg',
  MCB: 'mcb.svg',
  RCCB: 'rccb.svg',
  RCBO: 'rcbo.svg',
  Switches: 'switches.svg',
  'Modular Plates': 'modular-plates.svg',
  'Ceiling Fans': 'ceiling-fans.svg',
  'Exhaust Fans': 'exhaust-fans.svg',
  'Extension Boards': 'extension-boards.svg',
  Tools: 'tools.svg',
  'Weatherproof Devices': 'weatherproof-devices.svg'
};

const productImage = (subcategory) => asset(productAssetMap[subcategory] || 'electrical-placeholder.svg');
const productGallery = (subcategory) => [
  productImage(subcategory),
  productImage(subcategory),
  productImage(subcategory)
];

const deliveryProfile = (subcategory) => {
  if (['Armoured Cables', 'Control Cables'].includes(subcategory)) {
    return { dispatchTime: 2, estimatedDeliveryDaysMin: 5, estimatedDeliveryDaysMax: 8 };
  }
  if (['Ceiling Fans', 'Flood Lights', 'Weatherproof Devices'].includes(subcategory)) {
    return { dispatchTime: 1, estimatedDeliveryDaysMin: 4, estimatedDeliveryDaysMax: 6 };
  }
  if (['Switches', 'Modular Plates', 'LED Bulbs', 'Tools'].includes(subcategory)) {
    return { dispatchTime: 1, estimatedDeliveryDaysMin: 2, estimatedDeliveryDaysMax: 4 };
  }
  return { dispatchTime: 1, estimatedDeliveryDaysMin: 3, estimatedDeliveryDaysMax: 5 };
};

const slugValue = (value) =>
  value
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const brandLogo = (name) => `/demo-brands/${slugValue(name)}.svg`;

const buildExpandedProducts = () => {
  const catalog = [
    {
      sub: 'House Wires',
      rows: [
        ['Polycab', 'Green FR House Wire', '0.75 sq mm', '90 m coil', 760, 'FR grade copper house wire for lighting points and low load circuits.'],
        ['Finolex', 'Flame Retardant Copper Wire', '1 sq mm', '90 m coil', 980, 'High conductivity copper wire for reliable residential wiring.'],
        ['Havells', 'Life Line Plus HRFR Wire', '1.5 sq mm', '90 m coil', 1480, 'Heat resistant flexible house wire for lighting and fan circuits.'],
        ['RR Kabel', 'Superex FR PVC Wire', '2.5 sq mm', '90 m coil', 2390, 'Low leakage copper wire for sockets and appliance points.'],
        ['KEI', 'Homecab FRLS Wire', '4 sq mm', '90 m coil', 4480, 'FRLS copper conductor for heavy load home distribution.'],
        ['Anchor by Panasonic', 'PVC Insulated House Wire', '6 sq mm', '90 m coil', 6890, 'Premium insulated copper wire for mains and sub mains.']
      ]
    },
    {
      sub: 'Copper Flexible Wires',
      rows: [
        ['Polycab', 'Flexible Copper Wire Blue', '0.5 sq mm', '90 m coil', 620, 'Fine strand copper wire for luminaires and compact fixtures.'],
        ['Finolex', 'Flexible Copper Wire Red', '0.75 sq mm', '90 m coil', 820, 'Flexible wire with durable PVC insulation for panel connections.'],
        ['Havells', 'Multistrand Flexible Wire Yellow', '1 sq mm', '90 m coil', 1120, 'Smooth bending copper wire for appliances and control panels.'],
        ['RR Kabel', 'Flexible Copper Wire Black', '1.5 sq mm', '90 m coil', 1580, 'Flexible conductor for equipment wiring and repair jobs.'],
        ['KEI', 'PVC Flexible Wire Green', '2.5 sq mm', '90 m coil', 2490, 'Flexible copper wire for earthing jumpers and power points.'],
        ['V-Guard', 'Flexible Appliance Wire', '4 sq mm', '50 m coil', 2890, 'Heavy flexible wire for appliance and machine connections.']
      ]
    },
    {
      sub: 'Multicore Wires',
      rows: [
        ['V-Guard', '3 Core Round Cable', '3 core x 1 sq mm', '100 m drum', 2980, 'Round multicore cable for pumps and small appliances.'],
        ['Polycab', '3 Core Flexible Cable', '3 core x 1.5 sq mm', '100 m drum', 3890, 'Multicore copper cable for tools and portable equipment.'],
        ['Finolex', '4 Core Round Cable', '4 core x 1.5 sq mm', '100 m drum', 4820, 'Durable multicore cable for appliance and motor connections.'],
        ['Havells', '5 Core Copper Cable', '5 core x 2.5 sq mm', '50 m drum', 6480, 'Five core cable for machine wiring and control distribution.'],
        ['KEI', 'Submersible Flat Cable', '3 core x 2.5 sq mm', '100 m drum', 5980, 'Flat multicore cable for submersible pump installations.'],
        ['RR Kabel', 'Round Multicore Cable', '7 core x 1 sq mm', '100 m drum', 5320, 'Multicore cable for signalling and equipment control wiring.']
      ]
    },
    {
      sub: 'Armoured Cables',
      rows: [
        ['Polycab', 'XLPE Aluminium Armoured Cable', '2 core x 6 sq mm', '50 m drum', 7850, 'Armoured feeder cable for outdoor and underground runs.'],
        ['Havells', '3 Core Aluminium Armoured Cable', '3 core x 10 sq mm', '50 m drum', 16950, 'Steel armoured cable for commercial power distribution.'],
        ['KEI', '4 Core Armoured Power Cable', '4 core x 16 sq mm', '50 m drum', 31800, 'XLPE insulated armoured cable for panels and feeders.'],
        ['RR Kabel', 'Copper Armoured Cable', '4 core x 4 sq mm', '50 m drum', 14950, 'Copper conductor armoured cable for critical circuits.'],
        ['Finolex', 'Aluminium Armoured Cable', '3.5 core x 25 sq mm', '50 m drum', 43600, 'Heavy duty cable for three phase distribution systems.'],
        ['Polycab', 'LT Armoured Cable', '4 core x 25 sq mm', '50 m drum', 54900, 'Low tension armoured cable for industrial installations.']
      ]
    },
    {
      sub: 'Coaxial Cables',
      rows: [
        ['Finolex', 'RG6 Coaxial Cable White', 'RG6', '90 m coil', 1390, 'Low loss coaxial cable for TV, CCTV and broadband signals.'],
        ['Polycab', 'RG59 CCTV Coaxial Cable', 'RG59', '90 m coil', 1180, 'CCTV grade coaxial cable with clear signal transmission.'],
        ['Havells', 'RG6 Shielded Coax Cable', 'RG6 shielded', '100 m roll', 1680, 'Shielded coax cable for clean video and RF performance.'],
        ['V-Guard', 'TV Antenna Coaxial Cable', '75 ohm', '90 m coil', 1250, 'Reliable antenna cable for domestic and commercial TV points.'],
        ['Anchor by Panasonic', 'CCTV Coaxial Cable Roll', 'RG59 + power', '90 m roll', 1850, 'Combined CCTV coax and power cable for camera installs.'],
        ['KEI', 'Broadband Coax Cable', 'RG6 quad shield', '100 m roll', 2320, 'Quad shield cable for broadband and head-end distribution.']
      ]
    },
    {
      sub: 'Control Cables',
      rows: [
        ['Polycab', 'Copper Control Cable', '4 core x 1.5 sq mm', '100 m drum', 7250, 'Flexible control cable for panels and machine controls.'],
        ['KEI', 'Industrial Control Cable', '6 core x 1.5 sq mm', '100 m drum', 10150, 'Copper control cable for automation and signalling.'],
        ['RR Kabel', 'Numbered Core Control Cable', '8 core x 1 sq mm', '100 m drum', 9800, 'Numbered cable for tidy panel termination and tracing.'],
        ['Finolex', 'PVC Control Cable', '10 core x 1.5 sq mm', '100 m drum', 15800, 'Multi-core cable for control cabinets and instrumentation.'],
        ['Havells', 'Shielded Control Cable', '12 core x 1 sq mm', '100 m drum', 17650, 'Shielded control cable for reduced electrical noise.'],
        ['Polycab', 'Flexible Panel Control Cable', '16 core x 1 sq mm', '100 m drum', 21400, 'High core count cable for industrial panel wiring.']
      ]
    },
    {
      sub: 'LED Bulbs',
      rows: [
        ['Wipro Lighting', 'Garnet B22 LED Bulb', '9W B22', 'Pack of 4', 420, 'Energy efficient bulb with bright cool daylight output.'],
        ['Philips', 'Stellar Bright LED Bulb', '12W B22', 'Pack of 4', 560, 'Long life LED bulb for bedrooms, halls and shops.'],
        ['Bajaj Electricals', 'E27 LED Bulb Cool Daylight', '15W E27', 'Pack of 2', 390, 'High lumen bulb for workspaces and utility areas.'],
        ['Syska', 'LED Bulb Warm White', '9W B22', 'Pack of 6', 620, 'Warm white LED bulbs for comfortable home lighting.'],
        ['Havells', 'Adore LED Bulb', '18W B22', 'Pack of 2', 510, 'High wattage LED bulb for large room illumination.'],
        ['Wipro Lighting', 'Emergency Rechargeable Bulb', '9W B22', 'Single unit', 480, 'Rechargeable bulb with backup for power cuts.']
      ]
    },
    {
      sub: 'Flood Lights',
      rows: [
        ['Havells', 'Endura LED Flood Light', '30W IP65', 'Single unit', 1480, 'Weatherproof flood light for gates and outdoor walls.'],
        ['Wipro Lighting', 'High Power Flood Light', '50W IP66', 'Single unit', 2150, 'Bright outdoor flood light with die-cast aluminium body.'],
        ['Philips', 'SmartBright Flood Light', '70W IP65', 'Single unit', 3250, 'Commercial flood light for yards and parking areas.'],
        ['Bajaj Electricals', 'LED Outdoor Flood Light', '100W IP65', 'Single unit', 4290, 'High lumen outdoor light for security and building facades.'],
        ['Syska', 'Slim LED Flood Light', '150W IP66', 'Single unit', 6180, 'Slim flood light for industrial and sports lighting zones.'],
        ['Havells', 'Motion Sensor Flood Light', '20W IP65', 'Single unit', 1890, 'Sensor based flood light for automatic security lighting.']
      ]
    },
    {
      sub: 'MCB',
      rows: [
        ['Schneider Electric', 'Easy9 SP MCB C Curve', '6A SP', 'Single unit', 190, 'Single pole MCB for lighting and control circuits.'],
        ['Legrand', 'DX3 SP MCB C Curve', '16A SP', 'Single unit', 310, 'Reliable overload and short circuit protection device.'],
        ['Havells', 'Euro II DP MCB C Curve', '32A DP', 'Single unit', 780, 'Double pole MCB for residential distribution boards.'],
        ['IndoAsian', 'Caretron MCB', '40A DP', 'Single unit', 690, 'Compact MCB for home and shop installations.'],
        ['L&T Electrical', 'BBX FP MCB', '63A FP', 'Single unit', 1890, 'Four pole MCB for three phase distribution panels.'],
        ['Hager', 'C Curve MCB', '25A TP', 'Single unit', 1320, 'Triple pole breaker for balanced three phase protection.']
      ]
    },
    {
      sub: 'RCCB',
      rows: [
        ['Havells', 'Human Safety RCCB', '25A 30mA DP', 'Single unit', 1490, 'RCCB for personal safety against earth leakage.'],
        ['Schneider Electric', 'Easy9 RCCB', '40A 30mA DP', 'Single unit', 1790, 'Double pole RCCB for residential protection boards.'],
        ['Legrand', 'DX3 RCCB', '63A 30mA DP', 'Single unit', 2890, 'Sensitive residual current protection for homes and offices.'],
        ['IndoAsian', 'Four Pole RCCB', '40A 100mA FP', 'Single unit', 3180, 'Four pole RCCB for three phase circuits.'],
        ['L&T Electrical', 'TripSafe RCCB', '63A 100mA FP', 'Single unit', 3920, 'Industrial grade residual current protection device.'],
        ['Hager', 'RCCB Double Pole', '80A 30mA DP', 'Single unit', 4680, 'High capacity RCCB for large domestic loads.']
      ]
    },
    {
      sub: 'RCBO',
      rows: [
        ['Legrand', 'DX3 RCBO SPN', '16A 30mA', 'Single unit', 1990, 'Combined overcurrent and earth leakage protection.'],
        ['Schneider Electric', 'Acti9 RCBO', '20A 30mA', 'Single unit', 2380, 'RCBO for individual circuit safety and reliability.'],
        ['Havells', 'Euro II RCBO', '25A 30mA', 'Single unit', 2180, 'Compact RCBO for kitchen and appliance circuits.'],
        ['Hager', 'RCBO C Curve', '32A 30mA', 'Single unit', 2890, 'Residual current breaker with overload protection.'],
        ['IndoAsian', 'Caretron RCBO', '40A 30mA', 'Single unit', 2760, 'All-in-one safety breaker for modern distribution boards.'],
        ['L&T Electrical', 'RCBO SPN Device', '10A 30mA', 'Single unit', 2210, 'Dedicated RCBO for lighting and sensitive circuits.']
      ]
    },
    {
      sub: 'Switches',
      rows: [
        ['Anchor by Panasonic', 'Roma One Way Switch', '6A one way', 'Pack of 10', 520, 'Smooth modular switch for everyday residential use.'],
        ['Legrand', 'Myrius Modular Switch', '16A one way', 'Pack of 5', 690, 'Premium modular switch for appliance points.'],
        ['Goldmedal', 'Curve Two Way Switch', '6A two way', 'Pack of 10', 620, 'Two way switch for staircase and bedroom lighting.'],
        ['GM Modular', 'G-Magic Bell Push Switch', '6A bell push', 'Pack of 5', 460, 'Modular bell push switch with clean finish.'],
        ['Havells', 'Fabio Modular Switch', '10A one way', 'Pack of 10', 740, 'Stylish modular switches with dependable contacts.'],
        ['Anchor by Panasonic', 'Roma Dimmer Regulator', '400W dimmer', 'Single unit', 680, 'Fan and light dimmer module for modular plates.']
      ]
    },
    {
      sub: 'Modular Plates',
      rows: [
        ['Anchor by Panasonic', 'Roma Cover Plate', '3 module', 'Single unit', 110, 'Glossy modular plate for compact switchboards.'],
        ['Legrand', 'Myrius Modular Plate', '4 module', 'Single unit', 165, 'Premium cover plate with elegant white finish.'],
        ['Goldmedal', 'Curve Cover Plate', '6 module', 'Single unit', 210, 'Durable plate for medium size modular boards.'],
        ['GM Modular', 'G-Magic Plate', '8 module', 'Single unit', 250, 'Modern modular cover plate for home interiors.'],
        ['Havells', 'Fabio Cover Plate', '12 module', 'Single unit', 390, 'Large modular plate for living room switchboards.'],
        ['Anchor by Panasonic', 'Metal Box with Plate', '8 module', 'Set', 420, 'Concealed metal box and cover plate combo.']
      ]
    },
    {
      sub: 'Ceiling Fans',
      rows: [
        ['Crompton', 'Energion Ceiling Fan', '1200 mm', 'Single unit', 2890, 'Energy saving ceiling fan with strong air delivery.'],
        ['Orient Electric', 'Apex Prime Ceiling Fan', '1200 mm', 'Single unit', 1790, 'Reliable ceiling fan for bedrooms and halls.'],
        ['Usha', 'Bloom Magnolia Ceiling Fan', '1250 mm', 'Single unit', 3190, 'Decorative ceiling fan with premium finish.'],
        ['Bajaj Electricals', 'Maxima Ceiling Fan', '600 mm', 'Single unit', 1790, 'Compact ceiling fan for kitchen and balcony areas.'],
        ['Havells', 'Stealth Air Ceiling Fan', '1200 mm', 'Single unit', 4890, 'Silent performance fan for modern rooms.'],
        ['V-Guard', 'Esfera Ceiling Fan', '1200 mm', 'Single unit', 2450, 'High speed fan with durable motor winding.']
      ]
    },
    {
      sub: 'Exhaust Fans',
      rows: [
        ['Havells', 'Ventil Air Exhaust Fan', '150 mm', 'Single unit', 1180, 'Low noise exhaust fan for bathrooms and utility spaces.'],
        ['Crompton', 'Brisk Air Exhaust Fan', '200 mm', 'Single unit', 1490, 'Rust resistant exhaust fan for kitchens.'],
        ['Usha', 'Crisp Air Exhaust Fan', '250 mm', 'Single unit', 2190, 'Powerful ventilation fan for larger rooms.'],
        ['Bajaj Electricals', 'Maxima Exhaust Fan', '150 mm', 'Single unit', 980, 'Compact exhaust fan with efficient motor.'],
        ['Orient Electric', 'Hill Air Exhaust Fan', '200 mm', 'Single unit', 1390, 'Plastic body ventilation fan with smooth operation.'],
        ['V-Guard', 'Fresh Air Exhaust Fan', '300 mm', 'Single unit', 2680, 'High capacity exhaust fan for commercial ventilation.']
      ]
    },
    {
      sub: 'Extension Boards',
      rows: [
        ['Anchor by Panasonic', 'Four Socket Extension Board', '4 socket 5m', 'Single unit', 760, 'Heavy duty extension board with master switch.'],
        ['Havells', 'Spike Guard Extension Board', '4 socket 6A', 'Single unit', 980, 'Spike protected board for electronics and appliances.'],
        ['GM Modular', 'Power Strip with USB', '5 socket + USB', 'Single unit', 1290, 'Extension board with USB charging ports.'],
        ['Goldmedal', 'I-Strip Extension Board', '6 socket 5m', 'Single unit', 1150, 'Multi socket board with overload protection.'],
        ['Bajaj Electricals', 'Universal Extension Cord', '3 socket 3m', 'Single unit', 540, 'Compact extension board for home and office use.'],
        ['V-Guard', 'Surge Protector Board', '4 socket 10A', 'Single unit', 1380, 'Surge protected board for computers and TVs.']
      ]
    },
    {
      sub: 'Tools',
      rows: [
        ['Taparia', 'Insulated Screwdriver Set', '7 pieces', 'Kit', 540, 'Insulated screwdriver set for service and panel work.'],
        ['Stanley', 'Digital Clamp Meter', '600A AC', 'Single unit', 2190, 'Clamp meter for current and voltage measurement.'],
        ['Taparia', 'Combination Plier', '8 inch', 'Single unit', 360, 'Insulated plier for gripping and cutting electrical wires.'],
        ['Stanley', 'Wire Stripper Cutter', '0.5-6 sq mm', 'Single unit', 620, 'Wire stripper tool for clean conductor preparation.'],
        ['Fluke', 'Non Contact Voltage Tester', '90-1000V', 'Single unit', 2490, 'Voltage detector for quick safety checks.'],
        ['Taparia', 'Electrician Tool Pouch', '12 pocket', 'Single unit', 780, 'Durable pouch for everyday electrician tools.']
      ]
    },
    {
      sub: 'Weatherproof Devices',
      rows: [
        ['Schneider Electric', 'Weatherproof Isolator', '32A DP IP65', 'Single unit', 1680, 'Outdoor isolator enclosure for pumps and HVAC circuits.'],
        ['Legrand', 'Weatherproof Socket Box', '16A IP55', 'Single unit', 980, 'Protected socket enclosure for outdoor plug points.'],
        ['Havells', 'Outdoor Distribution Box', '8 way IP65', 'Single unit', 1890, 'Weatherproof DB for terraces and external areas.'],
        ['Hager', 'IP65 Enclosure', '12 module', 'Single unit', 2480, 'Outdoor enclosure for modular protection devices.'],
        ['L&T Electrical', 'Industrial Plug Socket', '32A 3 pin IP44', 'Single unit', 1260, 'Industrial plug socket for workshops and sites.'],
        ['GM Modular', 'Waterproof Junction Box', '150x110 mm', 'Single unit', 280, 'Weatherproof junction box for outdoor wire joints.']
      ]
    }
  ];

  const rows = [];
  catalog.forEach((group) => {
    group.rows.forEach(([brand, series, size, packing, basePrice, description], itemIndex) => {
      const variant = itemIndex + 1;
      const price = Math.round(basePrice * (1 + itemIndex * 0.03));
      const originalPrice = Math.round(price * (1.16 + (itemIndex % 3) * 0.04));
      const stock = 24 + ((group.sub.length + itemIndex * 17) % 210);
      rows.push([
        `${brand} ${series} ${size}`,
        group.sub,
        brand,
        price,
        originalPrice,
        stock,
        size,
        packing,
        description
      ]);
    });
  });
  return rows;
};

const seed = async () => {
  await connectDB();
  await Promise.all([
    User.deleteMany(),
    Category.deleteMany(),
    Brand.deleteMany(),
    Product.deleteMany(),
    Banner.deleteMany(),
    Coupon.deleteMany(),
    Settings.deleteMany(),
    Cart.deleteMany(),
    Wishlist.deleteMany(),
    Order.deleteMany(),
    Review.deleteMany(),
    DeliveryReward.deleteMany()
  ]);

  const [admin, customer, deliveryBoy] = await User.create([
    {
      name: 'VoltKart Admin',
      email: 'admin@voltkart.com',
      password: 'Admin123',
      phone: '9000000001',
      role: 'admin'
    },
    {
      name: 'Demo Customer',
      email: 'customer@voltkart.com',
      password: 'Customer123',
      phone: '9000000002',
      addresses: [
        {
          label: 'Home',
          fullName: 'Demo Customer',
          phone: '9000000002',
          line1: '42 Circuit Avenue',
          line2: 'Near Industrial Estate',
          city: 'Pune',
          state: 'Maharashtra',
          postalCode: '411001',
          isDefault: true
        }
      ]
    },
    {
      name: 'Ravi Delivery Partner',
      email: 'delivery@voltkart.com',
      password: 'Delivery123',
      phone: '9000000003',
      role: 'delivery',
      isActive: true
    }
  ]);

  const parents = await Category.create([
    { name: 'Wires & Cables', icon: 'cable', description: 'House wires, flexible wires, control cables and armoured cables.' },
    { name: 'Lighting', icon: 'lightbulb', description: 'LED bulbs, flood lights, panels and outdoor lighting.' },
    { name: 'Protection Devices', icon: 'shield', description: 'MCB, RCCB, RCBO and surge protection devices.' },
    { name: 'Switches & Accessories', icon: 'toggle-left', description: 'Modular switches, plates and sockets.' },
    { name: 'Fans & Appliances', icon: 'fan', description: 'Ceiling fans, exhaust fans and home electrical appliances.' },
    { name: 'Tools & Utilities', icon: 'wrench', description: 'Electrician tools, extension boards and weatherproof devices.' }
  ]);

  const parentByName = Object.fromEntries(parents.map((category) => [category.name, category]));
  const subs = await Category.create([
    { name: 'House Wires', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'Copper Flexible Wires', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'Multicore Wires', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'Armoured Cables', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'Coaxial Cables', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'Control Cables', parentCategory: parentByName['Wires & Cables']._id, icon: 'cable' },
    { name: 'LED Bulbs', parentCategory: parentByName.Lighting._id, icon: 'lightbulb' },
    { name: 'Flood Lights', parentCategory: parentByName.Lighting._id, icon: 'lightbulb' },
    { name: 'MCB', parentCategory: parentByName['Protection Devices']._id, icon: 'shield' },
    { name: 'RCCB', parentCategory: parentByName['Protection Devices']._id, icon: 'shield' },
    { name: 'RCBO', parentCategory: parentByName['Protection Devices']._id, icon: 'shield' },
    { name: 'Switches', parentCategory: parentByName['Switches & Accessories']._id, icon: 'toggle-left' },
    { name: 'Modular Plates', parentCategory: parentByName['Switches & Accessories']._id, icon: 'toggle-left' },
    { name: 'Ceiling Fans', parentCategory: parentByName['Fans & Appliances']._id, icon: 'fan' },
    { name: 'Exhaust Fans', parentCategory: parentByName['Fans & Appliances']._id, icon: 'fan' },
    { name: 'Extension Boards', parentCategory: parentByName['Tools & Utilities']._id, icon: 'plug' },
    { name: 'Tools', parentCategory: parentByName['Tools & Utilities']._id, icon: 'wrench' },
    { name: 'Weatherproof Devices', parentCategory: parentByName['Tools & Utilities']._id, icon: 'shield' }
  ]);
  const catByName = Object.fromEntries([...parents, ...subs].map((category) => [category.name, category]));

  const brands = await Brand.create([
    { name: 'Havells', logo: brandLogo('Havells') },
    { name: 'Polycab', logo: brandLogo('Polycab') },
    { name: 'Finolex', logo: brandLogo('Finolex') },
    { name: 'Legrand', logo: brandLogo('Legrand') },
    { name: 'Schneider Electric', logo: brandLogo('Schneider Electric') },
    { name: 'Anchor by Panasonic', logo: brandLogo('Anchor by Panasonic') },
    { name: 'Crompton', logo: brandLogo('Crompton') },
    { name: 'Bajaj Electricals', logo: brandLogo('Bajaj Electricals') },
    { name: 'V-Guard', logo: brandLogo('V-Guard') },
    { name: 'Wipro Lighting', logo: brandLogo('Wipro Lighting') },
    { name: 'RR Kabel', logo: brandLogo('RR Kabel') },
    { name: 'KEI', logo: brandLogo('KEI') },
    { name: 'Philips', logo: brandLogo('Philips') },
    { name: 'Syska', logo: brandLogo('Syska') },
    { name: 'IndoAsian', logo: brandLogo('IndoAsian') },
    { name: 'L&T Electrical', logo: brandLogo('L&T Electrical') },
    { name: 'Hager', logo: brandLogo('Hager') },
    { name: 'Goldmedal', logo: brandLogo('Goldmedal') },
    { name: 'GM Modular', logo: brandLogo('GM Modular') },
    { name: 'Orient Electric', logo: brandLogo('Orient Electric') },
    { name: 'Usha', logo: brandLogo('Usha') },
    { name: 'Taparia', logo: brandLogo('Taparia') },
    { name: 'Stanley', logo: brandLogo('Stanley') },
    { name: 'Fluke', logo: brandLogo('Fluke') }
  ]);
  const brandByName = Object.fromEntries(brands.map((brand) => [brand.name, brand]));

  const baseProductRows = [
    ['Polycab Green Wire 1.5 sq mm FR PVC 90m', 'House Wires', 'Polycab', 1420, 1710, 120, '1.5 sq mm', '90 m coil', 'FR PVC copper conductor for lights and general home wiring.'],
    ['Finolex Flame Retardant House Wire 2.5 sq mm 90m', 'House Wires', 'Finolex', 2380, 2790, 95, '2.5 sq mm', '90 m coil', 'High conductivity copper house wire for sockets and appliance circuits.'],
    ['Havells Life Line Plus 4 sq mm Copper Wire 90m', 'House Wires', 'Havells', 4580, 5250, 41, '4 sq mm', '90 m coil', 'Low leakage insulated wire for heavy domestic load wiring.'],
    ['Polycab Flexible Copper Wire 0.75 sq mm Blue 90m', 'Copper Flexible Wires', 'Polycab', 820, 1040, 160, '0.75 sq mm', '90 m coil', 'Flexible copper wire for panels, fixtures and low-load connections.'],
    ['Finolex Flexible Cable 1 sq mm Red 90m', 'Copper Flexible Wires', 'Finolex', 1120, 1390, 140, '1 sq mm', '90 m coil', 'Bright annealed copper conductor with durable PVC insulation.'],
    ['V-Guard 3 Core Multicore Cable 1.5 sq mm 100m', 'Multicore Wires', 'V-Guard', 3890, 4590, 38, '3 core x 1.5 sq mm', '100 m drum', 'Multicore cable for pumps, small motors and appliance wiring.'],
    ['Polycab 4 Core Armoured Cable 6 sq mm Aluminium', 'Armoured Cables', 'Polycab', 11950, 13990, 16, '4 core x 6 sq mm', '50 m drum', 'XLPE insulated armoured cable for feeder and outdoor power runs.'],
    ['Havells 3.5 Core Armoured Cable 16 sq mm Aluminium', 'Armoured Cables', 'Havells', 28400, 32500, 8, '3.5 core x 16 sq mm', '50 m drum', 'Heavy duty armoured cable for commercial distribution panels.'],
    ['Finolex RG6 Coaxial Cable 90m White', 'Coaxial Cables', 'Finolex', 1390, 1690, 75, 'RG6', '90 m coil', 'Low signal loss coaxial cable for CCTV, TV and broadband installations.'],
    ['Polycab 12 Core Control Cable 1.5 sq mm Copper', 'Control Cables', 'Polycab', 18400, 21900, 7, '12 core x 1.5 sq mm', '100 m drum', 'Flexible control cable for panels, automation and machine control.'],
    ['Wipro Garnet 9W B22 LED Bulb Pack of 4', 'LED Bulbs', 'Wipro Lighting', 420, 620, 260, '9W B22', 'Pack of 4', 'Energy efficient LED bulbs with bright cool daylight output.'],
    ['Bajaj 12W LED Bulb E27 Cool Daylight Pack of 6', 'LED Bulbs', 'Bajaj Electricals', 620, 850, 210, '12W E27', 'Pack of 6', 'Long life LED bulbs for homes, shops and work areas.'],
    ['Havells Endura 50W LED Flood Light IP65', 'Flood Lights', 'Havells', 2150, 2790, 24, '50W', 'Single unit', 'Weatherproof flood light for building facade and outdoor security lighting.'],
    ['Wipro 100W LED Flood Light IP66', 'Flood Lights', 'Wipro Lighting', 4290, 5290, 12, '100W', 'Single unit', 'High lumen outdoor flood light with pressure die-cast housing.'],
    ['Schneider Acti9 32A DP MCB C Curve', 'MCB', 'Schneider Electric', 810, 1040, 64, '32A DP', 'Single unit', 'Reliable miniature circuit breaker for overload and short-circuit protection.'],
    ['Legrand DX3 63A FP MCB C Curve', 'MCB', 'Legrand', 1980, 2450, 33, '63A FP', 'Single unit', 'Four pole MCB for distribution boards and commercial installations.'],
    ['Havells 40A 30mA RCCB Double Pole', 'RCCB', 'Havells', 1790, 2290, 28, '40A 30mA DP', 'Single unit', 'Residual current protection for personnel safety in homes and offices.'],
    ['Schneider Easy9 63A 100mA RCCB FP', 'RCCB', 'Schneider Electric', 3740, 4490, 18, '63A 100mA FP', 'Single unit', 'Four pole RCCB for three phase earth leakage protection.'],
    ['Legrand DX3 25A 30mA RCBO Single Pole', 'RCBO', 'Legrand', 2310, 2850, 15, '25A 30mA SPN', 'Single unit', 'Combined overload, short-circuit and earth leakage protection.'],
    ['Anchor Roma 6A One Way Modular Switch Pack of 10', 'Switches', 'Anchor by Panasonic', 520, 700, 310, '6A one way', 'Pack of 10', 'Smooth modular switches with durable contacts for everyday use.'],
    ['Legrand Myrius 16A Modular Switch White Pack of 5', 'Switches', 'Legrand', 690, 890, 170, '16A one way', 'Pack of 5', 'Premium modular switches for appliance points and modern interiors.'],
    ['Anchor Roma 8 Module White Modular Plate', 'Modular Plates', 'Anchor by Panasonic', 180, 260, 430, '8 module', 'Single unit', 'Glossy modular plate with sturdy frame for residential switchboards.'],
    ['Legrand Myrius 12 Module Cover Plate', 'Modular Plates', 'Legrand', 340, 450, 190, '12 module', 'Single unit', 'Elegant cover plate for large modular switchboard layouts.'],
    ['Crompton Energion 1200mm Ceiling Fan Brown', 'Ceiling Fans', 'Crompton', 2890, 3790, 36, '1200 mm', 'Single unit', 'Energy saving ceiling fan with high air delivery for bedrooms and halls.'],
    ['Bajaj Maxima 600mm Ceiling Fan White', 'Ceiling Fans', 'Bajaj Electricals', 1790, 2290, 42, '600 mm', 'Single unit', 'Compact ceiling fan for kitchen, balcony and small room applications.'],
    ['Havells Ventil Air DX 200mm Exhaust Fan', 'Exhaust Fans', 'Havells', 1490, 1890, 52, '200 mm', 'Single unit', 'Low noise exhaust fan for bathroom and kitchen ventilation.'],
    ['Crompton Brisk Air 150mm Exhaust Fan', 'Exhaust Fans', 'Crompton', 1040, 1390, 69, '150 mm', 'Single unit', 'Lightweight exhaust fan with rust resistant body.'],
    ['Anchor 4 Socket Extension Board with 5m Cable', 'Extension Boards', 'Anchor by Panasonic', 760, 990, 84, '4 socket', 'Single unit', 'Heavy duty extension board with master switch and long cable.'],
    ['Havells 6A Spike Guard Extension Board', 'Extension Boards', 'Havells', 980, 1290, 73, '6A 4 socket', 'Single unit', 'Spike protected extension board for computers and appliances.'],
    ['Taparia Electrician Screwdriver Kit 7 Pieces', 'Tools', 'Bajaj Electricals', 540, 690, 125, '7 pieces', 'Kit', 'Insulated screwdriver kit for panel wiring and service work.'],
    ['Schneider IP65 Weatherproof Isolator 32A DP', 'Weatherproof Devices', 'Schneider Electric', 1680, 2190, 26, '32A DP IP65', 'Single unit', 'Outdoor isolator enclosure for pumps, HVAC and exposed installations.']
  ];

  const productRows = [...baseProductRows, ...buildExpandedProducts()];

  await Product.create(
    productRows.map(([name, sub, brand, price, originalPrice, stock, size, packing, description], index) => {
      const subCategory = catByName[sub];
      const category = parents.find((item) => item._id.toString() === subCategory.parentCategory?.toString()) || subCategory;
      return {
        name,
        shortDescription: description,
        fullDescription: `${description} Built for professional electrical installations with dependable materials, clear markings and consistent performance.`,
        category: category._id,
        subcategory: subCategory._id,
        brand: brandByName[brand]._id,
        sku: `VK-${String(index + 1).padStart(4, '0')}`,
        images: productGallery(sub),
        price,
        originalPrice,
        stock,
        rating: Math.round((4 + Math.random()) * 10) / 10,
        numReviews: Math.floor(Math.random() * 140) + 8,
        specifications: {
          Type: sub,
          Brand: brand,
          'Conductor Size': size,
          Packing: packing,
          Length: packing.includes('m') ? packing : 'As per product pack',
          Warranty: sub.includes('Wire') || sub.includes('Cable') ? 'Manufacturer standard warranty' : '2 years manufacturer warranty',
          Application: category.name
        },
        featured: index % 4 === 0,
        tags: [sub, category.name, brand, size.split(' ')[0]].map((tag) => tag.toLowerCase()),
        shippingCharge: price > 2500 ? 0 : 99,
        warrantyAvailable: !['Modular Plates', 'Extension Boards'].includes(sub),
        warrantyText: sub.includes('Wire') || sub.includes('Cable')
          ? 'Manufacturer standard warranty against defects'
          : '2 Years Manufacturer Warranty',
        returnAvailable: !['House Wires', 'Armoured Cables', 'Control Cables'].includes(sub),
        returnWindowDays: ['LED Bulbs', 'Switches', 'Tools', 'Extension Boards'].includes(sub) ? 7 : 3,
        returnPolicyText: ['House Wires', 'Armoured Cables', 'Control Cables'].includes(sub)
          ? 'Returns are not available once cable is cut or dispatched.'
          : 'Return available for unused products in original packaging.',
        openBoxDeliveryAvailable: ['Ceiling Fans', 'Flood Lights', 'MCB', 'RCCB', 'RCBO'].includes(sub),
        openBoxDeliveryText: 'Open box inspection is available before accepting delivery.',
        codAvailable: !['Armoured Cables', 'Control Cables'].includes(sub),
        deliveryChargeType: price > 5000 ? 'free' : price > 2500 ? 'conditional' : 'fixed',
        fixedDeliveryCharge: price > 2500 ? 0 : 99,
        freeDeliveryMinOrderAmount: 2500,
        ...deliveryProfile(sub),
        weight: Math.round((price / 1000) * 10) / 10,
        popularity: 500 - index
      };
    })
  );

  await Banner.create([
    {
      title: 'Professional Electrical Supplies',
      subtitle: 'Shop certified wires, breakers, lighting and tools with fast dispatch.',
      image: asset('store-hero.svg'),
      link: '/products',
      placement: 'home-hero',
      sortOrder: 1
    },
    {
      title: 'Bulk Cable Deals',
      subtitle: 'Save more on house wires, armoured cables and control cables.',
      image: asset('bulk-cables.svg'),
      link: '/category/wires-cables',
      placement: 'home-hero',
      sortOrder: 2
    },
    {
      title: 'Safety First',
      subtitle: 'MCB, RCCB and RCBO protection devices from trusted brands.',
      image: asset('safety-devices.svg'),
      link: '/category/protection-devices',
      placement: 'home-offer',
      sortOrder: 3
    }
  ]);

  await Coupon.create([
    { code: 'POWER10', discountType: 'percentage', value: 10, maxDiscount: 750, minOrderAmount: 2000 },
    { code: 'WIRE250', discountType: 'fixed', value: 250, minOrderAmount: 3000 }
  ]);

  await Settings.create({
    storeName: 'VoltKart Electricals',
    supportEmail: 'support@voltkart.example',
    supportPhone: '+91 98765 43210',
    shippingCharge: 99,
    freeShippingThreshold: 2500,
    codEnabled: true,
    taxPercentage: 18,
    minimumOrderAmount: 299,
    perKilometerCharge: 12,
    maxServiceDistanceKm: 40,
    codCharge: 25,
    defaultDispatchDays: 1,
    defaultEtaMinDays: 3,
    defaultEtaMaxDays: 5,
    deliveryRewardActive: true,
    deliveryRewardThreshold: 20,
    deliveryRewardType: 'coupon',
    deliveryRewardCouponValue: 250,
    deliveryRewardBonusText: 'Daily delivery performance bonus earned.'
  });

  console.log('Seed complete');
  console.log('Admin: admin@voltkart.com / Admin123');
  console.log('Customer: customer@voltkart.com / Customer123');
  console.log('Delivery: delivery@voltkart.com / Delivery123');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
