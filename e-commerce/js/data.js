/**
 * Apex Sports — Product Catalog
 * Single source of truth for product data. In a later sprint this
 * will be replaced by an API call; for now it's a static module so
 * index.html and product.html can both import it with a plain <script> tag.
 */
/**
 * Builds a Pexels CDN image URL for a given photo id and width.
 * Pexels serves images directly from images.pexels.com/photos/{id}/... —
 * no API key needed for hotlinking. See https://www.pexels.com/license/.
 */
function pexelsImg(photoId, width = 800) {
  return `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
}

const PRODUCTS = [
  {
    id: 1,
    name: "Pro Match Football",
    category: "Football",
    price: 34.99,
    icon: "circle-dot",
    image: pexelsImg(47730),
    tag: "Bestseller",
    stock: 42,
    description: "Match-grade thermally bonded football with a water-resistant outer shell. Consistent flight and touch, built to FIFA-standard size and weight.",
    specs: ["Size 5 (official match size)", "Thermally bonded, water-resistant", "Butyl bladder for air retention", "Indoor & outdoor use"]
  },
  {
    id: 2,
    name: "Carbon Tennis Racket",
    category: "Tennis",
    price: 129.00,
    icon: "target",
    image: pexelsImg(80066),
    tag: "New",
    stock: 18,
    description: "Full carbon-fiber frame tuned for a blend of power and control. Aerodynamic throat design speeds up your swing without sacrificing stability.",
    specs: ["Full carbon-fiber composite frame", "100 sq in head size", "27in length, 300g unstrung", "Includes protective cover"]
  },
  {
    id: 3,
    name: "Indoor/Outdoor Basketball",
    category: "Basketball",
    price: 44.50,
    icon: "circle",
    image: pexelsImg(16302772),
    tag: "",
    stock: 30,
    description: "Composite leather basketball with deep channel grooves for reliable grip on both hardwood and asphalt courts.",
    specs: ["Composite leather cover", "Official size 7 (29.5\")", "Deep channel design for grip", "Suitable for indoor & outdoor courts"]
  },
  {
    id: 4,
    name: "Adjustable Dumbbell Set (20kg)",
    category: "Fitness",
    price: 189.99,
    icon: "dumbbell",
    image: pexelsImg(2652236),
    tag: "Bestseller",
    stock: 12,
    description: "Space-saving adjustable dumbbell pair that replaces a full rack. Dial in your weight in seconds with the quick-select locking mechanism.",
    specs: ["2.5kg – 20kg per dumbbell, adjustable", "Quick-select dial locking system", "Compact tray included", "Knurled, non-slip grip"]
  },
  {
    id: 5,
    name: "Trail Running Shoes",
    category: "Running",
    price: 98.00,
    icon: "footprints",
    image: pexelsImg(8373048),
    tag: "",
    stock: 25,
    description: "Lightweight trail runners with an aggressive lug pattern for grip on loose terrain, plus a rock plate for underfoot protection.",
    specs: ["Multi-directional traction lugs", "Embedded rock plate", "Breathable mesh upper", "8mm heel-to-toe drop"]
  },
  {
    id: 6,
    name: "Pro Grip Yoga Mat",
    category: "Fitness",
    price: 39.00,
    icon: "square",
    image: pexelsImg(4793328),
    tag: "",
    stock: 50,
    description: "Extra-thick natural rubber mat with a textured, sweat-resistant top layer that grips better the harder you work.",
    specs: ["6mm thickness", "Natural rubber base", "Sweat-resistant textured top", "Includes carry strap"]
  },
  {
    id: 7,
    name: "English Willow Cricket Bat",
    category: "Cricket",
    price: 149.99,
    icon: "flag",
    image: pexelsImg(20652481),
    tag: "New",
    stock: 9,
    description: "Grade 2 English willow bat with a mid-to-low swell profile, hand-pressed for a responsive sweet spot straight out of the wrapper.",
    specs: ["Grade 2 English willow", "Short handle, mid-low swell", "Hand-pressed, ready to play", "Weight: approx. 2lb 9oz"]
  },
  {
    id: 8,
    name: "Sparring Boxing Gloves",
    category: "Boxing",
    price: 59.99,
    icon: "hand",
    image: pexelsImg(10689269),
    tag: "",
    stock: 22,
    description: "Layered foam padding designed to protect both you and your sparring partner across long, repeated rounds.",
    specs: ["Multi-layer foam padding", "Adjustable wrist strap", "Synthetic leather shell", "Available 12oz–16oz"]
  },
  {
    id: 9,
    name: "Tennis Ball Tube (4pk)",
    category: "Tennis",
    price: 12.99,
    icon: "circle-dot",
    image: pexelsImg(226565),
    tag: "",
    stock: 80,
    description: "Pressurized championship-grade tennis balls with a felt cover that holds its bounce consistency through a full match.",
    specs: ["4 balls per pressurized tube", "High-vis optic yellow felt", "Regulation size & bounce", "Suitable for all court types"]
  },
  {
    id: 10,
    name: "Resistance Band Set",
    category: "Fitness",
    price: 24.99,
    icon: "waves",
    image: pexelsImg(5067744),
    tag: "",
    stock: 60,
    description: "Five-band resistance set covering light to heavy tension, with door anchor and handles for a full home strength circuit.",
    specs: ["5 bands: 10–50 lbs resistance", "Door anchor + ankle strap included", "Foam-padded handles", "Includes mesh carry bag"]
  },
  {
    id: 11,
    name: "Basketball Hoop Net",
    category: "Basketball",
    price: 14.50,
    icon: "hexagon",
    image: pexelsImg(19549580),
    tag: "",
    stock: 70,
    description: "All-weather replacement net that holds its shape through wind and rain, with the right amount of chain-net snap on makes.",
    specs: ["All-weather woven polyester", "Standard 12-loop fit", "UV-resistant coating", "Fits regulation rims"]
  },
  {
    id: 12,
    name: "Football Shin Guards",
    category: "Football",
    price: 19.99,
    icon: "shield",
    image: pexelsImg(38758878),
    tag: "",
    stock: 45,
    description: "Lightweight shin guards with a contoured EVA foam back and ventilated shell to stay cool and locked in place for 90 minutes.",
    specs: ["Contoured EVA foam backing", "Ventilated hard shell", "Adjustable ankle & calf straps", "Available S / M / L"]
  }
];
