import mongoose from "mongoose";
import { Product } from "../models/product.models.js";
import dotenv from "dotenv";
dotenv.config({
  path: "../../.env",
});
const products = [
  {
    name: "Samsung Galaxy S25 Ultra",
    description:
      "Samsung Galaxy S25 Ultra is the pinnacle of flagship engineering, packing a massive 200 MP quad‑camera array with 10× periscope zoom, 8K video capture, and cutting‑edge conversational AI powered by One UI 7. The 6.8″ QHD+ AMOLED display refreshes at up to 120 Hz and delivers brilliant HDR visuals. Under the hood, Snapdragon 8 Gen 4 (or Exynos variant) ensures ultra‑fast multitasking, while a massive 5000 mAh battery supports 45 W wired and 15 W wireless fast charging. Additional highlights include IP68 water resistance, S Pen support, UWB, Wi‑Fi 7, and seven years of guaranteed security and system updates.",
    price: 129999,
    brand: "Samsung",
    category: "Mobiles",
    image: "https://m.media-amazon.com/images/I/71uqj6BKnRL._SL1500_.jpg",
    rating: 4.8,
  },
  {
    name: "Xiaomi 15 Ultra",
    description:
      "The Xiaomi 15 Ultra is a camera‑first flagship featuring a 1‑inch 80 MP main sensor capable of 8K video, a periscope telephoto lens with 120× hybrid zoom, and advanced AI scene recognition. It runs Snapdragon 8 Gen 4, has a 6.73″ LTPO AMOLED display with 120 Hz refresh, and offers 120 W wired and 50 W wireless charging for its 5,000 mAh cell. Add in dual speakers, multimode 5G, and MIUI 15 based on Android 15, and you get a photography powerhouse priced under ₹1.1 lakh.",
    price: 109999,
    brand: "Xiaomi",
    category: "Mobiles",
    image:
      "https://m.media-amazon.com/images/I/81ql3U3xAwL._UF894,1000_QL80_.jpg",
    rating: 4.7,
  },
  {
    name: "Vivo X200 Pro",
    description:
      "Vivo X200 Pro combines Vivo’s ZEISS‑tuned camera optics with a 1/1.3″ 50 MP main sensor, 64 MP telephoto with 5× optical zoom, and 50 MP ultra‑wide. It’s powered by MediaTek Dimensity 9200+, features a 6.78″ LTPO AMOLED display at 120 Hz, and supports 120 W fast charging on its 5,500 mAh battery. Unique AI enhancements include real‑time image segmentation and upscaling. The device is elegantly built with vegan leather finish and is priced competitively around ₹85 k.",
    price: 84999,
    brand: "Vivo",
    category: "Mobiles",
    image:
      "https://rukminim2.flixcart.com/image/704/844/xif0q/mobile/k/i/g/-original-imahdxtvjq9symga.jpeg?q=90&crop=false",
    rating: 4.6,
  },
  {
    name: "OnePlus 13R",
    description:
      "OnePlus 13R offers flagship-level Hasselblad photography experience in a more affordable package. It includes a 50 MP main camera with OIS, 64 MP ultra‑wide lens, and 32 MP telephoto with 3× optical zoom. Powered by Snapdragon 8 Gen 3, alongside 12 GB RAM and 256 GB UFS 4.0 storage. A 6.8″ QHD+ OLED display with 120 Hz refresh rate and 5000 mAh battery with 100 W SuperVOOC charging round out the package. OxygenOS optimization delivers clean UI, long OS support, and seamless integration with OnePlus ecosystem.",
    price: 79999,
    brand: "OnePlus",
    category: "Mobiles",
    image:
      "https://image01-in.oneplus.net/media/202504/29/5e8757d9848875c3db01bb598022d254.png",
    rating: 4.6,
  },
  {
    name: "iQOO Neo 10R",
    description:
      "iQOO Neo 10R delivers excellent gaming and power users value with its Snapdragon 8‑series chipset, 120 Hz 6.78″ AMOLED display, and 55 MP OIS camera. A 6,000 mAh battery supports 120 W FlashCharge, giving full-day power in under 30 minutes. The phone is designed for competitive mobile gaming with liquid cooling, linear motor feedback, and a dedicated ‘Ultra Game Mode’. Exceptional overall performance under ₹55 k makes it popular in India’s value‑flagship segment.",
    price: 54999,
    brand: "iQOO",
    category: "Mobiles",
    image:
      "https://m.media-amazon.com/images/I/61wL8Qbo0HL._UF1000,1000_QL80_.jpg",
    rating: 4.5,
  },
  {
    name: "Poco F7 Ultra",
    description:
      "Poco F7 Ultra is aimed at power‑users and content creators—featuring Snapdragon 8 Gen 3, 6.67″ AMOLED 144 Hz display, and stereo speakers. A 5,000 mAh battery supports 90 W fast charging. Its triple‑camera system includes 50 MP primary, 8 MP ultrawide, and 2 MP depth sensor. While occasional software stutters are noted, overall value is considered excellent for ₹29,999 in India’s strong midrange segment.",
    price: 29999,
    brand: "Poco",
    category: "Mobiles",
    image:
      "https://i02.appmifile.com/mi-com-product/fly-birds/poco-f7-ultra/M/b7d9a5a452b4ba84cdc4abb69fb5d6bf.png",
    rating: 4.4,
  },
  {
    name: "Vivo T3X 5G",
    description:
      "Vivo T3X 5G offers 5G connectivity at ultra-affordable pricing (≈₹14,999). It sports a 6.72″ 120 Hz LCD display, a MediaTek Dimensity 6300 chip, and a 50 MP camera. A large 6,000 mAh battery and 44 W fast charging deliver excellent endurance. While the build is slim and audio is basic, most users praise its smooth daily usage and impressive specs at budget level.",
    price: 14999,
    brand: "Vivo",
    category: "Mobiles",
    image:
      "https://rukminim2.flixcart.com/image/850/1000/xif0q/mobile/d/x/1/-original-imah4kxes2ktzf9f.jpeg?q=20&crop=false",
    rating: 4.3,
  },
  {
    name: "Samsung Galaxy M35 5G",
    description:
      "Galaxy M35 5G brings Samsung reliability and features to the value segment with a 6,000 mAh battery, 120 Hz Super AMOLED display, and a 64 MP main camera. Powered by Exynos 1380, it offers smooth performance and supports 25 W fast charging. With IP67 water resistance and Samsung’s software support, it’s a safe, feature‑rich choice around ₹17–18 k.",
    price: 16998,
    brand: "Samsung",
    category: "Mobiles",
    image:
      "https://m.media-amazon.com/images/I/81DeHrvOoqL._UF1000,1000_QL80_.jpg",
    rating: 4.4,
  },
  {
    name: "Motorola Edge 60 Pro",
    description:
      "Motorola Edge 60 Pro features a MediaTek Dimensity 8350 chipset, 6.7″ pOLED display with 120 Hz refresh, and a stylish design in Pantone‑approved colors. The 50 MP triple‑camera system delivers good daylight performance, and its 5,000 mAh battery with 125 W rapid charging ensures minimal downtime. Priced between ₹30–34 k (8 GB/256 GB), it’s currently among the most searched and trending phones in India.",
    price: 32999,
    brand: "Motorola",
    category: "Mobiles",
    image:
      "https://m.media-amazon.com/images/I/81X7ol4FvUL._UF1000,1000_QL80_.jpg",
    rating: 4.3,
  },
  {
    name: "Sony WH-1000XM5",
    description:
      "Sony WH‑1000XM5 wireless headphones feature industry-leading noise cancellation using dual processors and 8 microphones. They deliver warm, balanced audio through 30 mm drivers and offer up to 30 hrs battery life with fast charging. Multipoint Bluetooth lets you pair two devices simultaneously.",
    price: 26999,
    brand: "Sony",
    category: "Electronics",
    image:
      "https://www.sony.co.in/image/6145c1d32e6ac8e63a46c912dc33c5bb?fmt=pjpeg&wid=330&bgcolor=FFFFFF&bgc=FFFFFF",
    rating: 4.8,
  },
  {
    name: "Bose QC45",
    description:
      "The Bose QuietComfort 45 headphones provide noise cancellation tuned for both travel and silence. Known for their lightweight design and extremely comfy fit, they deliver balanced audio with deep bass and crisp vocals. Up to 24 hours battery life, Bluetooth 5.1, and a Travel-Friendly Design.",
    price: 24999,
    brand: "Bose",
    category: "Electronics",
    image:
      "https://m.media-amazon.com/images/I/51HHABMPoVL._UF1000,1000_QL80_.jpg",
    rating: 4.7,
  },
  {
    name: "Apple AirPods Pro (2nd Gen)",
    description:
      "Apple`s AirPods Pro (2nd Gen) offer adaptive transparency and active noise cancellation. Powered by the H2 chip, they feature personalized Spatial Audio, Touch Controls, and a MagSafe charging case offering up to 30 hrs total battery life. Seamless integration with iOS devices.",
    price: 21999,
    brand: "Apple",
    category: "Electronics",
    image:
      "https://www.apple.com/v/airpods-pro/m/images/meta/og__eui2mpgzwyaa_overview.png",
    rating: 4.8,
  },
  {
    name: "Samsung Galaxy Buds2 Pro",
    description:
      "Galaxy Buds2 Pro deliver Hi-Res 24-bit audio, 360° spatial sound, and powerful active noise cancellation in an ergonomic lightweight design. Their 24-bit playback requires select Galaxy devices, plus ANC and voice pickup technology for calls.",
    price: 14999,
    brand: "Samsung",
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRKQ2VEW6JORmd33oaGiZWghq6m1W_fXoxrxw&s",
    rating: 4.6,
  },
  {
    name: "JBL Flip 6 Portable Speaker",
    description:
      "JBL Flip 6 is a rugged, waterproof (IPX7) Bluetooth speaker with 12 hrs of battery life and JBL’s signature deep bass Sound: This speaker delivers bold sound in a compact, travel-ready chassis.",
    price: 7999,
    brand: "JBL",
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5hM1mUeb-YN6BE8rPo3D9ZWkNeelxlOvi7w&s",
    rating: 4.6,
  },
  {
    name: "Canon EOS 200D II DSLR",
    description:
      "Canon EOS 200D II is a lightweight DSLR with a 24.1 MP APS-C sensor, DIGIC 8 image processor, and 4 K video recording capability. Featuring a user-friendly guided interface, it’s ideal for beginners and enthusiasts alike.",
    price: 47999,
    brand: "Canon",
    category: "Electronics",
    image:
      "https://in.canon/media/image/2019/04/09/cd7198fe980a4ed48be85ac376aec5d1_EOS+200D+MKII+BK+Front+Slant.png",
    rating: 4.7,
  },
  {
    name: "GoPro HERO12 Black",
    description:
      "The GoPro HERO12 Black is the latest action camera with HyperSmooth 7.0 stabilization, 5.3 K60 video, 27 MP photos, and waterproof durability up to 10 m. It supports live streaming and webcam functionality, plus advanced voice control.",
    price: 44999,
    brand: "GoPro",
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/61wsvCGXqnL.jpg",
    rating: 4.8,
  },
  {
    name: "Sony ZV-1 II Vlog Camera",
    description:
      "The Sony ZV‑1 II is a compact vlog camera with a 1″ sensor, 24‑70 mm f/1.8-2.8 lens, flip-out screen, and enhanced background defocus feature. It also supports 4 K30 video with active electronic stabilization and a directional 3‑capsule mic.",
    price: 64999,
    brand: "Sony",
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQD-S-e7YIKHWC2_yvgepG-UK9YrypCFoRiKQ&s",
    rating: 4.6,
  },
  {
    name: "Philips Hue White & Color Ambiance Starter Kit",
    description:
      "Philips Hue Starter Kit includes two smart bulbs and a Hue Bridge. With 16 million colors and full app control, it integrates with Alexa, Google Assistant, and Apple HomeKit. Set schedules, automations, and scenes effortlessly.",
    price: 9999,
    brand: "Philips",
    category: "Electronics",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQRq5fs_JUPOqTAzw6zUIbjPCNnVJHB9S3rkg&s",
    rating: 4.7,
  },
  {
    name: "DJI Mini 3 Pro",
    description:
      "DJI Mini 3 Pro is a portable drone with a 1/1.3″ CMOS sensor, 4 K/60fps video, Tri‑Direction Obstacle Sensing, and a flight time of up to 34 minutes. It's foldable, weighs under 249 g, and supports vertical shooting and ActiveTrack 4.0.",
    price: 74999,
    brand: "DJI",
    category: "Electronics",
    image: "https://m.media-amazon.com/images/I/610nnpm1VPL.jpg",
    rating: 4.8,
  },
  {
    name: 'Apple MacBook Air 15" (M2, 2023)',
    description:
      "The Apple MacBook Air 15″ with M2 chip combines sleek design with powerful performance. It features a stunning 15.3″ Liquid Retina display (2880×1864) with True Tone, the efficient M2 system-on-chip delivering up to 18 hours of battery life, and a fanless body that remains whisper‑quiet under everyday workloads. Comes with 8 GB unified memory and 512 GB SSD; ideal for students and professionals alike.",
    price: 189900,
    brand: "Apple",
    category: "Computers",
    image:
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mba15-skyblue-select-202503?wid=986&hei=980&fmt=jpeg&qlt=90&.v=REV4NmZ6SUhUbzJzVXZrcXZ3UGg2NjQ1bzN1SitYTU83Mm9wbk1xa1lWNUNrdXE2MVVlbXRFZG8wb3o1aWg1ZUJkRlpCNVhYU3AwTldRQldlSnpRa0JGbFFCaXFWTk5QRkxaWFZ6TExmVXM",
    rating: 4.9,
  },
  {
    name: "Dell XPS 13 Plus (2024)",
    description:
      "Dell XPS 13 Plus merges innovation and sleekness with a 13.4″ FHD+ OLED touch display and edge-to-edge keyboard. Powered by Intel 13th Gen Core i7, 16 GB LPDDR5 RAM, and 1 TB PCIe SSD. Includes Thunderbolt 4 ports, 4K webcam, and a premium machined aluminum chassis with carbon fiber palm rest.",
    price: 179999,
    brand: "Dell",
    category: "Computers",
    image: "https://cdn.mos.cms.futurecdn.net/BqDKDfg64ejuYgQkSMkxph.jpg",
    rating: 4.7,
  },
  {
    name: "Asus ROG Zephyrus G16",
    description:
      "The Asus ROG Zephyrus G16 is a thin and powerful gaming laptop with a 16″ QHD 165 Hz display. Powered by Ryzen 9 7940HS, 32 GB DDR5 RAM, RTX 4070 GPU, and 1 TB SSD. Designed for gamers and creators with exceptional performance in a sleek chassis.",
    price: 219999,
    brand: "Asus",
    category: "Computers",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuyp021R9Ngofg96EZ0XaG5UGq-zTJvC8W-A&s",
    rating: 4.8,
  },
  {
    name: "Lenovo ThinkPad X1 Carbon Gen 11",
    description:
      "Lenovo ThinkPad X1 Carbon Gen 11 is the ultralight business laptop champion, weighing just 1.13 kg. It includes a 14″ 2.8K OLED screen, Intel Core i7‑1355U, 16 GB LPDDR5, and 1 TB SSD. MIL‑STD 810H durability, four‑year warranty, fingerprint reader, and incredible battery life up to 22 hrs underscore its productivity pedigree.",
    price: 199999,
    brand: "Lenovo",
    category: "Computers",
    image: "https://m.media-amazon.com/images/I/61XXyxsfdRL.jpg",
    rating: 4.8,
  },
  {
    name: "HP Victus 15 (2024)",
    description:
      "HP Victus 15 is aimed at gamers on a budget. It includes a 15.6″ FHD 144 Hz panel, Intel Core i5‑12450H, RTX 4060 GPU, 16 GB RAM, and 512 GB SSD. The thermal design allows sustained performance during extended gaming sessions.",
    price: 99999,
    brand: "HP",
    category: "Computers",
    image: "https://m.media-amazon.com/images/I/61yP-HW6awL.jpg",
    rating: 4.6,
  },
  {
    name: "Microsoft Surface Pro 10",
    description:
      "Microsoft Surface Pro 10 combines tablet portability with laptop productivity. It features a 13″ PixelSense Flow touch display, Intel Core i5‑1345G7, 8 GB RAM, and 256 GB SSD. Includes detachable Type Cover keyboard, Surface Slim Pen 2 compatibility, and LTE options for on‑the‑go connectivity.",
    price: 159999,
    brand: "Microsoft",
    category: "Computers",
    image:
      "https://cdn-dynmedia-1.microsoft.com/is/image/microsoftcorp/MSFT-Surface-Pro-10-sneak-carousel-pivot-5?scl=1",
    rating: 4.7,
  },
  {
    name: "Acer Swift X 14",
    description:
      "Acer Swift X 14 is a lightweight creator's laptop with AMD Ryzen 7 5825U, NVIDIA RTX 3050 Ti graphics, and a 14″ 2.8K OLED display. It features 16 GB RAM, 1 TB SSD, and up to 10 hours battery—ideal for photo/video editing in a sleek 1.45 kg body.",
    price: 84999,
    brand: "Acer",
    category: "Computers",
    image:
      "https://m.media-amazon.com/images/I/71L7fUmjCZL._UF1000,1000_QL80_.jpg",
    rating: 4.6,
  },
  {
    name: "MacBook Pro 14″ (M3 Pro)",
    description:
      "Apple MacBook Pro 14″ with M3 Pro combines power and portability. This model offers a stunning Liquid Retina XDR display, up to 18‑core GPU, up to 36 GB unified memory, and up to 2 TB SSD. With a 70 Wh battery, it delivers up to 18 hours of video playback and includes MagSafe, HDMI, and SD card port.",
    price: 239900,
    brand: "Apple",
    category: "Computers",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdrHsH6AFcVeGzwhe2G4YuG2xACV8WrmyBwA&s",
    rating: 4.9,
  },
  {
    name: "LG Gram 17 (2024)",
    description:
      "LG Gram 17 is ultra‑light (1.35 kg) and spacious, with a 17″ WQXGA IPS display. It uses Intel Core i7‑1355U, 16 GB RAM, 1 TB SSD, Thunderbolt 4, and up to 22 hours battery. It's perfect for writers, students, and travelers who need screen space without weight.",
    price: 169999,
    maxStocks: 5,
    brand: "LG",
    category: "Computers",
    image: "https://cdn.mos.cms.futurecdn.net/XzFkKyMCazwxXeCLehobc5.jpg",
    rating: 4.7,
  },
  {
    name: "Razer Blade 15 (2024)",
    description:
      "Razer Blade 15 remains the thin & powerful gaming laptop to beat. It sports an Intel Core i9‑13950HX, NVIDIA RTX 4080, 32 GB DDR5, QHD 240 Hz display, vapor chamber cooling, per‑key Chroma RGB keyboard, and a CNC aluminum chassis—all in under 2 kg.",
    price: 319999,
    brand: "Razer",
    category: "Computers",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRz_W7rEALFz7q1VUTdPcPZM0TUZGBHvkwgUg&s",
    rating: 4.8,
  },
  {
    name: "Nike Air Zoom Pegasus 41",
    description:
      "The Nike Air Zoom Pegasus 41 is a versatile daily running shoe featuring responsive Zoom Air cushioning in the heel and forefoot. Its breathable engineered mesh upper includes flywire cables for a secure fit. The durable rubber outsole delivers reliable traction across pavement, while plush midsole foam offers comfort for long distances. A go-to shoe for runners and casual wearers alike.",
    price: 7999,
    brand: "Nike",
    category: "Shoes",
    image:
      "https://static.nike.com/a/images/t_PDP_936_v1/f_auto,q_auto:eco/d15d9326-cb42-430d-9abb-58a923e80205/AIR+ZOOM+PEGASUS+41+WIDE.png",
    rating: 4.5,
  },
  {
    name: "Adidas Ultraboost 23",
    description:
      "Adidas Ultraboost 23 combines a full-length Boost midsole, Primeknit+ upper, and Continental™ rubber outsole to deliver energy return and comfort mile after mile. This running flagship features a supportive heel counter and midfoot cage for stability. With cushioned comfort and a sleek look, it's appropriate for workouts or wardrobe enhancement.",
    price: 17499,
    brand: "Adidas",
    category: "Shoes",
    image:
      "https://assets.ajio.com/medias/sys_master/root/20230213/zZsC/63ea5182f997dde6f4a2194e/-473Wx593H-469322447-black-MODEL.jpg",
    rating: 4.7,
  },
  {
    name: "Puma Future Rider Play On",
    description:
      "Puma Future Rider Play On revives the iconic '80s design with cushioned Rider foam midsole and soft suede/nylon upper. The cushioned footbed gives day-long comfort, while tooling provides retro style. Ideal for casual wear with vibrant colorways to match any outfit.",
    price: 4999,
    brand: "Puma",
    category: "Shoes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQsMy5_KhZkqu46CydTALECiDN1VwmV9iTadA&s",
    rating: 4.4,
  },
  {
    name: "Asics Gel-Kayano 30",
    description:
      "Asics Gel-Kayano 30 is a premium stability shoe featuring FF Blast+ Turbo cushioning, a 3D Space Construction midsole, and rearfoot GEL technology for impact absorption. The engineered mesh upper adds support and breathability. Ideal for long-distance runners seeking structured comfort.",
    price: 15999,
    brand: "Asics",
    category: "Shoes",
    image:
      "https://www.asics.co.in/media/catalog/product/1/0/1011b548_005_sr_rt_glb-base.jpg",
    rating: 4.6,
  },
  {
    name: "New Balance 574",
    description:
      "A classic icon, the New Balance 574 features an ENCAP midsole for comfort and durability, suede/mesh upper, and a step counter outsole for reliable everyday wear. Its retro aesthetic and color-rich options add style to any urban wardrobe.",
    price: 8999,
    brand: "New Balance",
    category: "Shoes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-f5CyKlqvTnAPhwXeA2_BOJT96wvAmVENxA&s",
    rating: 4.3,
  },
  {
    name: "Reebok Nano X3",
    description:
      "The Reebok Nano X3 training shoe offers versatility with Floatride Energy foam cushioning, molded heel clip, and Flexweave upper. Designed for high-intensity workouts, CrossFit, or gym sessions, it provides stability, flexibility, and breathable comfort.",
    price: 12499,
    brand: "Reebok",
    category: "Shoes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRojs7B0erhEwuZZ2nOEdm9R1wp60BXKd1hGQ&s",
    rating: 4.5,
  },
  {
    name: "Skechers GO WALK 7",
    description:
      "Skechers GO WALK 7 features ULTRA GO cushioning and high-rebound GO PILLAR for comfort and support, ideal for all-day walking. The lightweight knit mesh upper adds breathability, and the flexible design suits urban or light trail use.",
    price: 5499,
    brand: "Skechers",
    category: "Shoes",
    image:
      "https://www.skechers.in/on/demandware.static/-/Sites-skechers_india/default/dw4e898719/images/large/196989294063-1.jpg",
    rating: 4.4,
  },
  {
    name: "Crocs Classic Clog",
    description:
      "The Crocs Classic Clog is made of lightweight Croslite™ foam, offering uncompromising comfort and easy slip-on design. The pivoting heel strap adds secure wearability, and the ventilated upper keeps feet cool. A top choice for casual, beach, or at-home wear.",
    price: 2999,
    brand: "Crocs",
    category: "Shoes",
    image: "https://m.media-amazon.com/images/I/61QXxSlFv6L._UY1000_.jpg",
    rating: 4.5,
  },
  {
    name: "Salomon Speedcross 6",
    description:
      "Salomon Speedcross 6 is a trail running shoe designed with aggressive lugged Contagrip outsole, SensiFit upper, and EnergyCell midsole for rugged terrain grip and cushioning. Ideal for off-road runners seeking maximum traction in any weather.",
    price: 13999,
    brand: "Salomon",
    category: "Shoes",
    image: "https://m.media-amazon.com/images/I/71Fog0iJsoL._SY395_.jpg",
    rating: 4.6,
  },
  {
    name: "Birkenstock Arizona Soft Footbed",
    description:
      "The Birkenstock Arizona sandals feature a soft cork-latex footbed that conforms to your foot over time, providing arch support and deep heel cup. With soft suede lining, adjustable straps, and EVA sole, they're comfortable, durable, and stylish for everyday wear.",
    price: 7999,
    brand: "Birkenstock",
    maxStocks: 100,
    category: "Shoes",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSPGxNwaylnoBcUltuM9zsULkFekEk5QVs0gg&s",
    rating: 4.7,
  },
  {
    name: "Apple Watch Series 10 (44 mm)",
    description:
      "The Apple Watch Series 10 sports a 20% brighter always-on Retina display and advanced health sensors, including blood oxygen, ECG, and sleep apnea detection. Water resistant to 50 m and featuring faster S9 dual-core chip, it supports predictive health insights and up to 18 hours of battery life. Pair with your iPhone for seamless experience.",
    price: 42000,
    brand: "Apple",
    maxStocks: 100,
    category: "Watches",
    image:
      "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/s10-case-unselect-gallery-1-202503_GEO_IN_FMT_WHH?wid=752&hei=720&fmt=p-jpg&qlt=80&.v=T1poMzZuRzBxQ1RzQmhMUHprUE5LZHlVRllKam5abHNZRGludXlMbytKN1NaTlNrS3RJM3dxeGVTRXREd05KZXdNcFdFNWZtdVQ0djE1UTRwRU5lcXlaSE1Qa0haZTFvMWVJTkxjaWwxSnpLcGxxV2Q5dEt1MVE0V0pJUTNTMDZvWkpWVlFLUkNlRlJVNmdjanFGa3R3",
    rating: 4.8,
  },
  {
    name: "Samsung Galaxy Watch 7 Classic (46 mm)",
    description:
      "Galaxy Watch 7 Classic features a rotating bezel around a 1.4″ Super AMOLED always-on display, dual-core Exynos W1000, and BioActive sensors for ECG, blood pressure, SpO₂, and body composition. Offers LTE support, 5-day battery life, and robust MIL-STD-810G durability.",
    price: 29999,
    maxStocks: 100,
    brand: "Samsung",
    category: "Watches",
    image: "https://m.media-amazon.com/images/I/51RJTOjXNiL._UY1100_.jpg",
    rating: 4.6,
  },
  {
    name: "Fossil Gen 6 Smartwatch",
    description:
      "Fossil Gen 6 pairs an AMOLED touchscreen with built-in Alexa voice assistant, SpO₂ and heart rate monitoring, GPS, and rapid charging finishing in 30 minutes for 80% battery. Designed for modern professionals and fitness enthusiasts, it supports rich third-party apps via Wear OS.",
    price: 17995,
    maxStocks: 100,
    brand: "Fossil",
    category: "Watches",
    image:
      "https://m.media-amazon.com/images/I/71Vqggkd8hL._UF1000,1000_QL80_.jpg",
    rating: 4.4,
  },
  {
    name: "Garmin Fenix 7 Pro",
    description:
      "The Garmin Fenix 7 Pro is a rugged multisport GPS smartwatch with solar charging, built-in maps, sensors for wrist-based heart rate, pulse ox, and respiration. It supports activity tracking for dozens of sports, up to 18 days battery life, and robust design for outdoor adventurers.",
    maxStocks: 100,
    price: 79999,
    brand: "Garmin",
    category: "Watches",
    image:
      "https://contents.mediadecathlon.com/m13394243/6b6e32975dd3691aa736eee3194cc2ef/m13394243.jpg?format=auto&quality=70&f=2520x0",
    rating: 4.7,
  },
  {
    name: "Titan Octane Smart Pro",
    description:
      "The Titan Octane Smart Pro packs a 1.95″ AMOLED display, SpO₂, ECG and full health tracking, plus AI-based fitness routines. Offers 30 sport modes, 7-day battery, stress tracker, and Bluetooth calling—all in a sleek 44 mm metal design.",
    price: 8999,
    maxStocks: 100,
    brand: "Titan",
    category: "Watches",
    image: "https://m.media-amazon.com/images/I/51EqcQnv7BL.jpg",
    rating: 4.3,
  },
  {
    name: "Noise ColorFit Pro 5 Alpha",
    description:
      "Noise ColorFit Pro 5 Alpha features a 1.8″ HD AMOLED display, Bluetooth calling, SpO₂, HRV, stress monitoring, 100+ sports modes, and IP68 water resistance. Delivers performance insights through the NoiseFit ecosystem with up to 10 days battery life.",
    price: 4999,
    maxStocks: 100,
    brand: "Noise",
    category: "Watches",
    image: "https://m.media-amazon.com/images/I/71PXkv-smcL.jpg",
    rating: 4.2,
  },
  {
    name: "TAG Heuer Connected Calibre E4",
    description:
      "TAG Heuer Connected Calibre E4 brings a premium Swiss watchmaker experience to smartwatches — with a 45 mm AMOLED display, Snapdragon Wear 4100+, GPS, heart rate sensor, NFC, and Google Wear OS. It combines elegance with rich smart features and multiple coach apps.",
    price: 259999,
    maxStocks: 100,
    brand: "TAG Heuer",
    category: "Watches",
    image:
      "https://www.tagheuer.com/on/demandware.static/-/Sites-tagheuer-master/default/dw01e9bb93/TAG_Heuer_Connected_/SBR8A80.BT6261/SBR8A80.BT6261_0913.png?impolicy=resize&width=664&height=498",
    rating: 4.5,
  },
  {
    name: "Timex Ironman Classic 50-Lap",
    description:
      "Timex Ironman Classic 50-Lap is a rugged sports watch featuring 50-lap memory, 100‑hour chronograph, countdown timer, and Indiglo backlight. It’s water-resistant to 100 m and built for serious athletes on a budget.",
    price: 3499,
    brand: "Timex",
    maxStocks: 100,
    category: "Watches",
    image: "https://m.media-amazon.com/images/I/61-1sCF1pCL._SL1000_.jpg",
    rating: 4.3,
  },
  {
    name: "Casio G-Shock GA-2100 “CasiOak”",
    description:
      "The Casio G-Shock GA-2100, nicknamed “CasiOak”, is a slim carbon core analog-digital watch with 200 m water resistance, shock resistance, and double LED illumination. It offers world time, alarms, stopwatch, and a sporty design inspired by luxury steel watches.",
    price: 9999,
    brand: "Casio",
    maxStocks: 100,
    category: "Watches",
    image:
      "https://www.casio.com/content/dam/casio/product-info/locales/in/en/timepiece/product/watch/G/GA/GA2/GA-2100-1A1/assets/GA-2100-1A1_Seq01.png.transform/main-visual-sp/image.png",
    rating: 4.6,
  },
  {
    name: "SEIKO Prospex Solar Diver",
    description:
      "Seiko Prospex Solar Diver (SNE599) is a reliable analog dive watch powered by solar movement (no battery change). It’s water-resistant to 200 m, has luminous hands/markers, and a stainless-steel case. Perfect for divers and watch enthusiasts seeking eco-friendly durability.",
    price: 14999,
    brand: "Seiko",
    category: "Watches",
    maxStocks: 100,
    image:
      "https://seikowatches.co.in/cdn/shop/files/SNE597P1.png?v=1744601890",
    rating: 4.6,
  },
  {
    name: "Tata Tea Gold 1 kg",
    description:
      "Tata Tea Gold is a premium blend of Assam CTC leaf and long tea leaves, delivering a rich aroma, robust flavor, and consistent taste with every cup. This 1 kg pack ensures freshness for extended use and is perfect for classic Indian morning or evening tea rituals.",
    price: 499,
    maxStocks: 100,
    brand: "Tata",
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/61XPM-WJV6L._SL1000_.jpg",
    rating: 4.6,
  },
  {
    name: "Amul Pure Ghee 1 L",
    description:
      "Amul Pure Ghee is made from premium cow milk and double‑filtered to ensure purity and rich nutritional value. It’s high in vitamins A, D, E & K and adds authentic aroma and flavor to both Indian sweets and everyday cooking.",
    maxStocks: 100,
    price: 749,
    brand: "Amul",
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/81iwctfHH9L.jpg",
    rating: 4.7,
  },
  {
    name: "Red Label Tea 1 kg",
    description:
      "Brooke Bond Red Label is a strong CTC blend designed for Indian taste buds, offering a bold color, quick brewing, and consistent flavor. Ideal for daily consumption, it combines trust and taste in one pack.",
    price: 449,
    maxStocks: 100,
    brand: "Brooke Bond",
    category: "Groceries",
    image:
      "https://m.media-amazon.com/images/I/51w5MjPB7KL._UF1000,1000_QL80_.jpg",
    rating: 4.5,
  },
  {
    name: "Maggi Masala 70 g (Pack of 10)",
    description:
      "Maggi Masala Instant Noodles are India’s favorite snack—ready in under 2 minutes. Each packet has the signature tastemaker, combined with enriched wheat noodles. Convenient, tasty, and perfect for a quick meal any time of day.",
    price: 129,
    maxStocks: 100,
    brand: "Maggi",
    category: "Groceries",
    image:
      "https://www.jiomart.com/images/product/original/490000363/maggi-2-minute-masala-noodles-70-g-product-images-o490000363-p490000363-0-202305292130.jpg",
    rating: 4.4,
  },
  {
    name: "Nestlé Everyday Dairy Whitener 1 kg",
    description:
      "Nestlé Everyday is a creamy dairy whitener made from pure cow milk solids and skimmed milk, enhancing the taste of tea or coffee. With multigrain added nutrition, it delivers a smooth, milky taste that balances strength and energy.",
    price: 599,
    maxStocks: 100,
    brand: "Nestlé",
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/71fwfzc-iSL.jpg",
    rating: 4.6,
  },
  {
    name: "MDH Garam Masala 100 g",
    description:
      "MDH Garam Masala is an aromatic Indian spice blend made from 13 handpicked spices including cinnamon, cardamom, and cloves. Used to enhance curries, gravies, biryanis, and more with a warm, flavorful touch.",
    price: 249,
    brand: "MDH",
    maxStocks: 100,
    category: "Groceries",
    image:
      "https://www.bbassets.com/media/uploads/p/l/100004473_4-mdh-masala-garam.jpg",
    rating: 4.5,
  },
  {
    name: "Tupperware Water Bottle Set (4×1 L)",
    description:
      "Tupperware reusable water bottle set includes four BPA-free, leak-proof 1 L bottles ideal for work, school, travel, or home. Each features a durable flip-top lid and ergonomic design, making hydration convenient and eco-friendly.",
    price: 899,
    brand: "Tupperware",
    maxStocks: 100,
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/91dWmugtFkL._SL1500_.jpg",
    rating: 4.6,
  },
  {
    name: "Amul Cheese Slices 200 g",
    description:
      "Amul Cheese processed cheese slices are smooth, meltable, and perfect for sandwiches, burgers, or snacks. Made from cow milk, they deliver consistent taste and melting quality with each piece.",
    price: 129,
    maxStocks: 100,
    brand: "Amul",
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/71vM-znOuDL.jpg",
    rating: 4.5,
  },
  {
    name: "Fortune Rice Bran Health Oil 1 L",
    description:
      "Fortune Rice Bran Health Oil is made from rice bran and chosen quality vegetable oils for a light, healthy cooking experience. Packed with antioxidants, it’s perfect for frying, sautéing, and daily cooking—promoting heart health.",
    price: 299,
    brand: "Fortune",
    maxStocks: 100,
    category: "Groceries",
    image: "https://m.media-amazon.com/images/I/71WBHionksL.jpg",
    rating: 4.6,
  },
  {
    name: "Parle-G Biscuit 2 kg",
    description:
      "Parle-G is the classic glucose biscuit loved across generations for its sweet, simple taste and nostalgic crunch. This economical family pack is perfect for tea time, snacks, and lunchboxes.",
    price: 299,
    brand: "Parle-G",
    maxStocks: 100,
    category: "Groceries",
    image:
      "https://www.jiomart.com/images/product/original/491583791/parle-g-gold-biscuits-2-kg-product-images-o491583791-p590033315-0-202311281814.jpg",
    rating: 4.5,
  },
  {
    name: "L'Oréal Revitalift Hyaluronic Acid Serum 30 ml",
    description:
      "L'Oréal Revitalift Hyaluronic Acid Serum deeply hydrates skin, plumping fine lines and improving elasticity. Its formula with high‑molecular‑weight HA, Pro‑Retinol, and glycerin helps restore skin’s moisture barrier in just one week. Suitable for all skin types and can be used twice daily.",
    price: 1399,
    maxStocks: 100,
    brand: "L'Oréal",
    category: "Beauty",
    image: "https://m.media-amazon.com/images/I/51dyKxcQAaL.jpg",
    rating: 4.4,
  },
  {
    name: "Maybelline Fit Me Matte + Poreless Foundation 30 ml",
    description:
      "Maybelline Fit Me Matte + Poreless Foundation gives a natural, shine-free look for normal to oily skin. Available in 40 shades, it blends seamlessly for a smooth complexion. Its breathable formula is enriched with micro-powders that control oil and refine pores.",
    price: 549,
    maxStocks: 100,
    brand: "Maybelline",
    category: "Beauty",
    image:
      "https://m.media-amazon.com/images/I/61s1Mke1JAL._UF1000,1000_QL80_.jpg",
    rating: 4.3,
  },
  {
    name: "The Body Shop Vitamin C Glow Boost Mask 75 ml",
    description:
      "The Body Shop Vitamin C Glow Boost Mask exfoliates and brightens skin in just 5 minutes. It contains Amazonian Camu Camu berries, acerola, and vitamin C to rejuvenate dull or tired skin. Use once or twice weekly for radiant results.",
    price: 1249,
    brand: "The Body Shop",
    maxStocks: 100,
    category: "Beauty",
    image:
      "https://media.thebodyshop.in/media/catalog/product/1/0/1019268_overnight_peel_vitamin_c_100ml_a0x_bronze_nw_inaclps072_-_copy.jpg?format=auto&height=750",
    rating: 4.5,
  },
  {
    name: "Nykaa SKINRX HA Booster Drops 30 ml",
    description:
      "Nykaa SkinRX HA Booster Drops provide deep hydration using plant‑based hyaluronic acids, vitamins B5 and amino acids. The lightweight watery serum absorbs quickly, plumping and smoothing the skin—ideal for combination to dry skin types.",
    price: 649,
    brand: "Nykaa",
    maxStocks: 100,
    category: "Beauty",
    image:
      "https://images-static.nykaa.com/media/catalog/product/8/2/82cc28cNYKAB00000077_1.jpg?tr=w-500",
    rating: 4.6,
  },
  {
    name: "Nivea Soft Light Moisturizer 200 ml",
    description:
      "Nivea Soft is a light yet deeply hydrating moisturizer enriched with vitamin E and jojoba oil. Suitable for face, hands, and body, it absorbs quickly and leaves skin feeling smooth and soft. Great for daily use on all skin types.",
    price: 299,
    brand: "Nivea",
    maxStocks: 100,
    category: "Beauty",
    image:
      "https://m.media-amazon.com/images/I/61UP6RvA9wL._UF1000,1000_QL80_.jpg",
    rating: 4.5,
  },
  {
    name: "Lakmé Absolute Matte Melt Liquid Lipstick 5 ml",
    description:
      "Lakmé Absolute Matte Melt Liquid Lipstick offers rich, matte color in one swipe with long-lasting wear and creamy feel. Available in vibrant shades with comfortable, non‑sticky texture. Enriched with vitamins to prevent dryness.",
    price: 549,
    brand: "Lakmé",
    maxStocks: 100,
    category: "Beauty",
    image:
      "https://www.lakmeindia.com/cdn/shop/products/29117_H1-8901030851704_1000x.jpg?v=1652866216",
    rating: 4.4,
  },
  {
    name: "Mamaearth Ubtan Face Cleanser 150 ml",
    description:
      "Mamaearth Ubtan Face Cleanser is made from turmeric, saffron, and walnut granules. It provides gentle exfoliation, removes tan and lightens complexions while maintaining the skin’s pH balance. Suitable for all skin types, especially dull or uneven skin.",
    price: 499,
    brand: "Mamaearth",
    maxStocks: 100,
    category: "Beauty",
    image:
      "https://m.media-amazon.com/images/I/61v50QQS-tL._UF1000,1000_QL80_.jpg",
    rating: 4.6,
  },
  {
    name: "Lotus Herbals Safe Sun UV Screen Matte Gel SPF 50 50 g",
    description:
      "Lotus Herbals Safe Sun UV Screen Matte Gel offers broad-spectrum SPF 50 protection in a lightweight matte gel formula. Enriched with Vitamin E and bioflavonoids, it protects against UVA/UVB rays while controlling oil and giving a non‑greasy finish.",
    price: 449,
    maxStocks: 100,
    brand: "Lotus Herbals",
    category: "Beauty",
    image:
      "https://www.jiomart.com/images/product/original/490729108/lotus-herbals-safe-sun-uv-screen-spf-50-pa-matte-gel-for-normal-to-oily-skin-50-g-product-images-o490729108-p490729108-0-202410101852.jpg?im=Resize=(1000,1000)",
    rating: 4.5,
  },
  {
    name: "Himalaya Herbals Purifying Neem Face Wash 200 ml",
    description:
      "Himalaya Purifying Neem Face Wash uses neem and turmeric to cleanse skin deeply, removing acne-causing bacteria while retaining moisture. It's mild, paraben-free, and suitable for daily use, especially on oily/acne-prone skin.",
    price: 249,
    brand: "Himalaya",
    maxStocks: 100,

    category: "Beauty",
    image:
      "https://m.media-amazon.com/images/I/51Svkx9-N6L._UF1000,1000_QL80_.jpg",
    rating: 4.3,
  },
  {
    name: "Maybelline New York Hypercurl Mascara 10 ml",
    description:
      "Maybelline Hypercurl Mascara offers instant lift and curl with a volumizing formula. Its flexible brush coats every lash, providing up to 24 hours curl retention and smudge-proof wear. Ideal for dramatic eye looks.",
    price: 399,
    brand: "Maybelline",
    maxStocks: 100,
    category: "Beauty",
    image: "https://m.media-amazon.com/images/I/51Y2UGLW+bL.jpg",
    rating: 4.4,
  },
  {
    name: "Forest Essentials Pure Rosewater Toner 90 ml",
    description:
      "Forest Essentials Pure Rosewater Toner is made with steam-distilled Kashmiri roses, perfect for refreshing and hydrating the skin. It helps tone, nourishes pores, and prepares skin for better absorption of serums and moisturizers.",
    price: 799,
    maxStocks: 100,
    brand: "Forest Essentials",
    category: "Beauty",
    image:
      "https://m.media-amazon.com/images/I/61rbTaFvwEL._UF1000,1000_QL80_.jpg",
    rating: 4.6,
  },
];
const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    await Product.deleteMany();
    const result = await Product.insertMany(products);
    console.log(`${result.length} products inserted`);
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding products:", error);
    process.exit(1);
  }
};
seedProducts();
