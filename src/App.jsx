
import React, { useMemo, useState } from "react";
import {
  Home, Store, Shirt, CalendarDays, Settings, BookOpen,
  WashingMachine, Wind, Sparkles, Truck, User, Users,
  Phone, MapPin, Clock, Plus, Minus, Trash2, Edit,
  Search, Check, X, Camera, Package, ClipboardList,
  CreditCard, Banknote, ChevronRight, ArrowLeft, Save,
  Eye, Menu, Info, History, Image, ShoppingBag, Receipt, ChartNoAxesCombined,
  Droplets, Calculator, Printer, TrendingUp, PackageCheck,
} from "lucide-react";

const initialClothing = [
  { id: 1, name: "เสื้อยืด", price: 8, ironingPrice: 5, category: "เสื้อผ้า", image: "" },
  { id: 2, name: "กางเกงขาสั้น", price: 5, ironingPrice: 5, category: "เสื้อผ้า", image: "" },
  { id: 3, name: "กางเกงขายาว", price: 10, ironingPrice: 8, category: "เสื้อผ้า", image: "" },
  { id: 4, name: "เสื้อเชิ้ต", price: 12, ironingPrice: 10, category: "เสื้อผ้า", image: "" },
  { id: 5, name: "ผ้าห่ม", price: 20, ironingPrice: 0, category: "เครื่องนอน", image: "" },
  { id: 6, name: "ผ้าปูที่นอน", price: 15, ironingPrice: 5, category: "เครื่องนอน", image: "" },
  { id: 7, name: "ผ้าขนหนู", price: 8, ironingPrice: 0, category: "เครื่องนอน", image: "" },
  { id: 8, name: "ชุดเดรส", price: 20, ironingPrice: 12, category: "เสื้อผ้า", image: "" },
];

const initialProducts = [
  { id: 1, name: "น้ำยาซักผ้า", brand: "DEMO", type: "น้ำยาซักผ้า", scent: "กลิ่นหอมสดชื่น", price: 120, image: "", stock: 5, unit: "ขวด", description: "" },
  { id: 2, name: "น้ำยาปรับผ้านุ่ม", brand: "DEMO", type: "น้ำยาปรับผ้านุ่ม", scent: "กลิ่นดอกไม้", price: 95, image: "", stock: 3, unit: "ขวด", description: "" },
  { id: 3, name: "ผลิตภัณฑ์ขจัดคราบ", brand: "DEMO", type: "ขจัดคราบ", scent: "ไม่ระบุ", price: 150, image: "", stock: 2, unit: "ขวด", description: "" },
];

const initialBookings = [
  {
    id: "DEMO-001",
    name: "คุณสมชาย",
    phone: "0812345678",
    method: "dropoff",
    address: "",
    pickupDate: "",
    pickupTime: "",
    items: [
      { clothingId: 1, name: "เสื้อยืด", quantity: 5, price: 8 },
      { clothingId: 2, name: "กางเกงขาสั้น", quantity: 2, price: 5 },
    ],
    services: ["ซัก", "อบ"],
    total: 50,
    status: "รอตรวจรับผ้า",
    paymentMethod: "ชำระตอนรับผ้าคืน",
    paymentStatus: "รอชำระเงิน",
    note: "แยกผ้าสีและผ้าขาว",
    detergents: [],
    defectImage: "",
    returnImage: "",
    returnDate: "",
    createdAt: "2026-11-10T10:00:00",
  },
  {
    id: "DEMO-002",
    name: "คุณสมหญิง",
    phone: "0898765432",
    method: "pickup",
    address: "บ้านเลขที่ 99 ตำบลในเมือง",
    pickupDate: "2026-11-14",
    pickupTime: "10:00",
    items: [
      { clothingId: 5, name: "ผ้าห่ม", quantity: 1, price: 20 },
    ],
    services: ["ซัก", "อบ"],
    total: 25,
    status: "รอเข้ารับผ้า",
    paymentMethod: "โอนเงินก่อนส่งคืน",
    paymentStatus: "รอตรวจสอบสลิป",
    note: "โทรแจ้งก่อนเข้ารับผ้า",
    detergents: ["น้ำยาซักผ้า"],
    defectImage: "",
    returnImage: "",
    returnDate: "",
    createdAt: "2026-11-11T09:30:00",
  },
];

const services = [
  { id: "ซัก", name: "ซักผ้า", price: 0, icon: WashingMachine, description: "ทำความสะอาดเสื้อผ้าและเครื่องนอน" },
  { id: "อบ", name: "อบผ้า", price: 5, icon: Wind, description: "ช่วยให้ผ้าแห้งพร้อมใช้งาน" },
  { id: "รีด", name: "รีดผ้า", price: 0, icon: Sparkles, description: "คิดราคาแยกตามประเภทผ้า" },
];

const money = (value) => Number(value || 0).toLocaleString("th-TH");

const dateText = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("th-TH", { dateStyle: "medium", timeStyle: "short" });
};

function readStored(key, fallback) {
  try { const value = localStorage.getItem(key); return value ? JSON.parse(value) : fallback; } catch { return fallback; }
}

function readImage(file, callback) {
  if (!file) return;
  if (!file.type.startsWith("image/")) {
    alert("กรุณาเลือกไฟล์รูปภาพ");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => callback(reader.result);
  reader.readAsDataURL(file);
}

const defaultTheme = {
  pageBg: "#eaf1f6",
  surface: "#ffffff",
  accentBg: "#eaf4fb",
  border: "#d8e4ed",
  navBg: "#dae8f3",
  primary: "#397fa9",
  heading: "#244b68",
  text: "#263f55",
  muted: "#5f778c",
  navOpacity: 68,
  fontSize: 15,
};

function App() {
  const [page, setPage] = useState("login");
  const [adminTab, setAdminTab] = useState("overview");
  const [mobileMenu, setMobileMenu] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [loggedInAs, setLoggedInAs] = useState("");
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [loginError, setLoginError] = useState("");
  const [authView, setAuthView] = useState("login");
  const [registerForm, setRegisterForm] = useState({ name: "", phone: "", address: "", username: "", password: "", confirmPassword: "" });
  const [registerError, setRegisterError] = useState("");
  const [registeredAccounts, setRegisteredAccounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem("demoLaundryMembers") || "[]"); }
    catch { return []; }
  });

  const [clothing, setClothing] = useState(() => readStored("demoLaundryClothing", initialClothing));
  const [products, setProducts] = useState(() => readStored("demoLaundryProducts", initialProducts));
  const [bookings, setBookings] = useState(() => readStored("demoLaundryBookings", initialBookings));
  const [stockMovements, setStockMovements] = useState(() => readStored("demoLaundryStockMovements", []));
  const [stockDrafts, setStockDrafts] = useState({});
  const [reportMonth, setReportMonth] = useState(new Date().toISOString().slice(0, 7));
  const [calculatorValue, setCalculatorValue] = useState("0");
  const [calculatorExpression, setCalculatorExpression] = useState("");
  const [calculatorHistory, setCalculatorHistory] = useState([]);

  const [shopOpen, setShopOpen] = useState(true);
  const [shopReason, setShopReason] = useState("เจ้าของร้านมีธุระส่วนตัว");
  const [shopMessage, setShopMessage] = useState(
    "ร้านเปิดให้บริการตามปกติ สามารถนำผ้ามาส่งและจองคิวได้"
  );

  const [customerSearch, setCustomerSearch] = useState("");
  const [clothingSearch, setClothingSearch] = useState("");
  const [clothingCategory, setClothingCategory] = useState("ทั้งหมด");
  const [quantityDrafts, setQuantityDrafts] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [guideTab, setGuideTab] = useState("customer");
  const [notice, setNotice] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return { ...defaultTheme, ...JSON.parse(localStorage.getItem("demoLaundryTheme") || "{}") };
    } catch {
      return defaultTheme;
    }
  });

  const [form, setForm] = useState({
    name: "",
    phone: "",
    method: "dropoff",
    address: "",
    pickupDate: "",
    pickupTime: "",
    items: [],
    services: ["ซัก"],
    note: "",
    paymentMethod: "ชำระตอนรับผ้าคืน",
  });

  const [newClothing, setNewClothing] = useState({
    name: "", price: "", ironingPrice: "", category: "เสื้อผ้า", image: "",
  });
  const [editingClothing, setEditingClothing] = useState(null);

  const [newProduct, setNewProduct] = useState({
    name: "", brand: "", type: "น้ำยาซักผ้า", scent: "", price: "", description: "", image: "", stock: "", unit: "ขวด",
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const selectedBooking = bookings.find((b) => b.id === selectedBookingId);

  const customerRecords = useMemo(() => {
    const groups = new Map();

    bookings.forEach((booking) => {
      const phone = (booking.phone || "").replace(/\D/g, "");
      const key = phone || booking.name.trim().toLowerCase();

      if (!groups.has(key)) {
        groups.set(key, {
          key,
          name: booking.name,
          phone: booking.phone,
          bookings: [],
        });
      }
      groups.get(key).bookings.push(booking);
    });

    return [...groups.values()].map((customer) => {
      const sorted = [...customer.bookings].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      return {
        ...customer,
        bookings: sorted,
        count: sorted.length,
        paid: sorted
          .filter((b) => b.paymentStatus === "ชำระเงินแล้ว")
          .reduce((sum, b) => sum + Number(b.total || 0), 0),
        total: sorted.reduce((sum, b) => sum + Number(b.total || 0), 0),
      };
    });
  }, [bookings]);

  const filteredCustomers = customerRecords.filter((customer) =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    (customer.phone || "").includes(customerSearch)
  );

  const activeCustomer = customerRecords.find(
    (customer) => customer.key === selectedCustomer
  );

  const totalItems = form.items.reduce((sum, item) => sum + item.quantity, 0);
  const clothingCategories = ["ทั้งหมด", ...new Set(clothing.map((item) => item.category || "อื่น ๆ"))];
  const filteredClothing = clothing.filter((item) =>
    (clothingCategory === "ทั้งหมด" || (item.category || "อื่น ๆ") === clothingCategory) &&
    item.name.toLowerCase().includes(clothingSearch.trim().toLowerCase())
  );
  const selectedClothingTotal = form.items.reduce((sum, item) => sum + item.quantity * item.price, 0);

  const calculateBreakdown = (items, selectedServices) => {
    const count = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
    const washing = selectedServices.includes("ซัก")
      ? items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0) : 0;
    const drying = selectedServices.includes("อบ") ? count * 5 : 0;
    const ironing = selectedServices.includes("รีด")
      ? items.reduce((sum, item) => sum + Number(item.ironingPrice ?? 5) * Number(item.quantity || 0), 0) : 0;
    return { washing, drying, ironing, total: washing + drying + ironing };
  };
  const calculateTotal = (items, selectedServices) => calculateBreakdown(items, selectedServices).total;
  const bookingBreakdown = calculateBreakdown(form.items, form.services);
  const bookingTotal = bookingBreakdown.total;

  React.useEffect(() => { try { localStorage.setItem("demoLaundryClothing", JSON.stringify(clothing)); } catch {} }, [clothing]);
  React.useEffect(() => { try { localStorage.setItem("demoLaundryProducts", JSON.stringify(products)); } catch {} }, [products]);
  React.useEffect(() => { try { localStorage.setItem("demoLaundryBookings", JSON.stringify(bookings)); } catch {} }, [bookings]);
  React.useEffect(() => { try { localStorage.setItem("demoLaundryStockMovements", JSON.stringify(stockMovements)); } catch {} }, [stockMovements]);

  const updateTheme = (key, value) => {
    setTheme((previous) => {
      const updated = { ...previous, [key]: value };
      try { localStorage.setItem("demoLaundryTheme", JSON.stringify(updated)); } catch {}
      return updated;
    });
  };

  const resetTheme = () => {
    setTheme(defaultTheme);
    try { localStorage.setItem("demoLaundryTheme", JSON.stringify(defaultTheme)); } catch {}
    showNotice("คืนค่าธีมเริ่มต้นแล้ว");
  };

  const showNotice = (message) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const goTo = (nextPage) => {
    if (!isAuthenticated && nextPage !== "login") {
      setPage("login");
      return;
    }
    if (nextPage === "admin" && userRole !== "admin") {
      showNotice("เมนูนี้สำหรับเจ้าของร้านเท่านั้น");
      return;
    }
    setPage(nextPage);
    setMobileMenu(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLogin = (event) => {
    event.preventDefault();
    const username = loginForm.username.trim();
    const password = loginForm.password;
    const demoAccounts = {
      admin: { password: "1234", role: "admin", label: "เจ้าของร้าน" },
      customer: { password: "1234", role: "customer", label: "ลูกค้า DEMO" },
    };
    const account = demoAccounts[username] || registeredAccounts.find((member) => member.username === username);
    if (!account || account.password !== password) {
      setLoginError("ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองอีกครั้ง");
      return;
    }
    setIsAuthenticated(true);
    setUserRole(account.role);
    if (account.role === "customer") setGuideTab("customer");
    setLoggedInAs(account.label);
    if (account.role === "customer" && account.name) {
      setForm((previous) => ({
        ...previous,
        name: account.name || account.label || previous.name,
        phone: account.phone || previous.phone,
        address: account.address || previous.address,
      }));
    }
    setLoginError("");
    setLoginForm({ username: "", password: "" });
    setPage("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRegister = (event) => {
    event.preventDefault();
    const name = registerForm.name.trim();
    const phone = registerForm.phone.trim();
    const address = registerForm.address.trim();
    const username = registerForm.username.trim();
    const password = registerForm.password;
    if (name.length < 2) return setRegisterError("กรุณากรอกชื่อ-นามสกุลให้ถูกต้อง");
    if (!/^0[0-9]{9}$/.test(phone)) return setRegisterError("กรุณากรอกเบอร์โทรศัพท์ 10 หลัก");
    if (address.length < 8) return setRegisterError("กรุณากรอกที่อยู่ให้ครบถ้วน เพื่อใช้สำหรับบริการรับผ้าถึงบ้าน");
    if (!/^[a-zA-Z0-9_]{4,20}$/.test(username)) return setRegisterError("ชื่อผู้ใช้ต้องมี 4–20 ตัว ใช้ภาษาอังกฤษ ตัวเลข หรือ _");
    if (password.length < 4) return setRegisterError("รหัสผ่านต้องมีอย่างน้อย 4 ตัวอักษร");
    if (password !== registerForm.confirmPassword) return setRegisterError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
    if (["admin", "customer"].includes(username.toLowerCase()) || registeredAccounts.some((member) => member.username.toLowerCase() === username.toLowerCase())) return setRegisterError("ชื่อผู้ใช้นี้ถูกใช้แล้ว กรุณาเลือกชื่อผู้ใช้อื่น");
    if (registeredAccounts.some((member) => member.phone === phone)) return setRegisterError("เบอร์โทรศัพท์นี้ลงทะเบียนแล้ว");
    const newMember = { name, phone, address, username, password, role: "customer", label: name };
    const updated = [...registeredAccounts, newMember];
    setRegisteredAccounts(updated);
    try { localStorage.setItem("demoLaundryMembers", JSON.stringify(updated)); } catch {}
    setRegisterForm({ name: "", phone: "", address: "", username: "", password: "", confirmPassword: "" });
    setRegisterError("");
    setLoginForm({ username, password });
    setAuthView("login");
    setLoginError("สมัครสมาชิกสำเร็จ! กรุณากดเข้าสู่ระบบด้วยบัญชีที่สมัคร");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole(null);
    setLoggedInAs("");
    setPage("login");
    setMobileMenu(false);
    setSelectedCustomer(null);
    setSelectedBookingId(null);
  };

  const updateForm = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const changeQuantity = (product, amount) => {
    setForm((previous) => {
      const found = previous.items.find((item) => item.clothingId === product.id);
      let items;

      if (found) {
        items = previous.items
          .map((item) =>
            item.clothingId === product.id
              ? { ...item, quantity: item.quantity + amount }
              : item
          )
          .filter((item) => item.quantity > 0);
      } else {
        items = amount > 0
          ? [...previous.items, {
              clothingId: product.id,
              name: product.name,
              quantity: amount,
              price: Number(product.price),
              ironingPrice: Number(product.ironingPrice || 0),
            }]
          : previous.items;
      }

      return { ...previous, items };
    });
  };

  const toggleService = (serviceId) => {
    setForm((previous) => ({
      ...previous,
      services: previous.services.includes(serviceId)
        ? previous.services.filter((s) => s !== serviceId)
        : [...previous.services, serviceId],
    }));
  };

  const submitBooking = (event) => {
    event.preventDefault();

    if (!shopOpen) {
      showNotice("ขณะนี้ร้านปิดให้บริการ ยังไม่สามารถจองคิวได้");
      return;
    }
    if (!form.name.trim() || !form.phone.trim()) {
      showNotice("กรุณากรอกชื่อและเบอร์โทรศัพท์");
      return;
    }
    if (form.items.length === 0) {
      showNotice("กรุณาเลือกประเภทผ้าอย่างน้อย 1 รายการ");
      return;
    }
    if (form.services.length === 0) {
      showNotice("กรุณาเลือกบริการอย่างน้อย 1 รายการ");
      return;
    }
    if (form.method === "pickup") {
      if (!form.address.trim() || !form.pickupDate || !form.pickupTime) {
        showNotice("กรุณากรอกที่อยู่ วันและเวลาสำหรับรับผ้า");
        return;
      }
    }

    const newBooking = {
      ...form,
      id: `DEMO-${String(Date.now()).slice(-6)}`,
      total: bookingTotal,
      breakdown: bookingBreakdown,
      status: form.method === "pickup" ? "รอเข้ารับผ้า" : "รอตรวจรับผ้า",
      paymentStatus: form.paymentMethod === "โอนเงินก่อนส่งคืน"
        ? "รอตรวจสอบสลิป" : "รอชำระเงิน",
      detergents: [],
      defectImage: "",
      returnImage: "",
      returnDate: "",
      createdAt: new Date().toISOString(),
    };

    setBookings((previous) => [newBooking, ...previous]);
    setForm({
      name: form.name, phone: form.phone, method: "dropoff", address: form.address,
      pickupDate: "", pickupTime: "", items: [],
      services: ["ซัก"], note: "",
      paymentMethod: "ชำระตอนรับผ้าคืน",
    });
    showNotice("ส่งรายการจองคิว DEMO สำเร็จ");
    goTo("home");
  };

  const updateBooking = (id, changes) => {
    setBookings((previous) => previous.map((b) => {
      if (b.id !== id) return b;
      const updated = { ...b, ...changes };
      if (changes.paymentStatus === "ชำระเงินแล้ว" && b.paymentStatus !== "ชำระเงินแล้ว") updated.paidAt = new Date().toISOString();
      if (changes.paymentStatus && changes.paymentStatus !== "ชำระเงินแล้ว") updated.paidAt = "";
      return updated;
    }));
  };

  const addClothing = (event) => {
    event.preventDefault();
    if (!newClothing.name.trim() || newClothing.price === "") {
      showNotice("กรุณากรอกชื่อประเภทผ้าและราคา");
      return;
    }
    setClothing((previous) => [
      ...previous,
      { ...newClothing, id: Date.now(), price: Number(newClothing.price), ironingPrice: Number(newClothing.ironingPrice || 0) },
    ]);
    setNewClothing({ name: "", price: "", ironingPrice: "", category: "เสื้อผ้า", image: "" });
    showNotice("เพิ่มประเภทผ้าเรียบร้อย");
  };

  const saveClothing = () => {
    if (!editingClothing?.name.trim() || editingClothing.price === "") {
      showNotice("กรุณากรอกข้อมูลให้ครบ");
      return;
    }
    setClothing((previous) =>
      previous.map((item) => item.id === editingClothing.id
        ? { ...editingClothing, price: Number(editingClothing.price), ironingPrice: Number(editingClothing.ironingPrice || 0) }
        : item
      )
    );
    setEditingClothing(null);
    showNotice("บันทึกการแก้ไขประเภทผ้าแล้ว");
  };

  const deleteClothing = (id) => {
    if (!window.confirm("ต้องการลบประเภทผ้านี้หรือไม่?")) return;
    setClothing((previous) => previous.filter((item) => item.id !== id));
    showNotice("ลบประเภทผ้าแล้ว");
  };

  const addProduct = (event) => {
    event.preventDefault();
    if (!newProduct.name.trim()) {
      showNotice("กรุณากรอกชื่อผลิตภัณฑ์");
      return;
    }
    setProducts((previous) => [
      ...previous,
      { ...newProduct, id: Date.now(), price: Number(newProduct.price || 0), stock: Number(newProduct.stock || 0) },
    ]);
    setNewProduct({
      name: "", brand: "", type: "น้ำยาซักผ้า",
      scent: "", price: "", description: "", image: "", stock: "", unit: "ขวด",
    });
    showNotice("เพิ่มผลิตภัณฑ์เรียบร้อย");
  };

  const saveProduct = () => {
    if (!editingProduct?.name.trim()) {
      showNotice("กรุณากรอกชื่อผลิตภัณฑ์");
      return;
    }
    setProducts((previous) =>
      previous.map((item) => item.id === editingProduct.id
        ? { ...editingProduct, price: Number(editingProduct.price || 0), stock: Number(editingProduct.stock || 0) }
        : item
      )
    );
    setEditingProduct(null);
    showNotice("บันทึกผลิตภัณฑ์แล้ว");
  };

  const deleteProduct = (id) => {
    if (!window.confirm("ต้องการลบผลิตภัณฑ์นี้หรือไม่?")) return;
    setProducts((previous) => previous.filter((item) => item.id !== id));
    showNotice("ลบผลิตภัณฑ์แล้ว");
  };

  const adjustStock = (productId, direction) => {
    const draft = stockDrafts[productId] || {};
    const amount = Number(draft.amount || 0);
    if (!Number.isFinite(amount) || amount <= 0) { showNotice("กรุณาระบุจำนวนที่มากกว่า 0"); return; }
    const product = products.find((item) => item.id === productId);
    if (!product) return;
    if (direction === "out" && amount > Number(product.stock || 0)) { showNotice("จำนวนเบิกใช้มากกว่าสต็อกคงเหลือ"); return; }
    const nextStock = Number(product.stock || 0) + (direction === "in" ? amount : -amount);
    setProducts((previous) => previous.map((item) => item.id === productId ? { ...item, stock: nextStock } : item));
    setStockMovements((previous) => [{ id: Date.now(), productId, productName: product.name, direction, amount, unit: product.unit || "หน่วย", stockAfter: nextStock, createdAt: new Date().toISOString() }, ...previous]);
    setStockDrafts((previous) => ({ ...previous, [productId]: { amount: "" } }));
    showNotice(direction === "in" ? "บันทึกการเติมสต็อกแล้ว" : "บันทึกการเบิกใช้แล้ว");
  };

  const printReceipt = () => window.print();
  const printReport = () => window.print();
  const pressCalculator = (key) => {
    if (key === "C") { setCalculatorValue("0"); setCalculatorExpression(""); return; }
    if (key === "⌫") { setCalculatorValue((value) => value.length <= 1 ? "0" : value.slice(0, -1)); return; }
    if (key === "=") {
      try {
        const expression = calculatorValue.replace(/×/g, "*").replace(/÷/g, "/");
        if (!/^[0-9+\-*/(). ]+$/.test(expression)) return;
        const result = Function(`"use strict"; return (${expression})`)();
        if (Number.isFinite(result)) {
          const formatted = String(Number(result.toFixed(2)));
          setCalculatorHistory((previous) => [{ expression: calculatorValue, result: formatted }, ...previous].slice(0, 6));
          setCalculatorExpression(`${calculatorValue} =`);
          setCalculatorValue(formatted);
        }
      } catch { showNotice("ไม่สามารถคำนวณนิพจน์นี้ได้"); }
      return;
    }
    setCalculatorValue((value) => value === "0" && /[0-9.]/.test(key) ? key : value + key);
  };

  const statusColor = (status) => {
    if (["เสร็จสิ้น", "ชำระเงินแล้ว", "ส่งคืนแล้ว"].includes(status)) return "green";
    if (["ยกเลิก"].includes(status)) return "red";
    if (["กำลังดำเนินการ", "กำลังซัก", "กำลังอบ", "กำลังรีด"].includes(status)) return "blue";
    return "orange";
  };

  const navItems = [
    ["home", "หน้าแรก", Home],
    ["services", "บริการ", WashingMachine],
    ["catalog", "รายการผ้า", Shirt],
    ["booking", "จองคิว", CalendarDays],
    ["guide", "คู่มือการใช้งาน", BookOpen],
    ...(userRole === "admin" ? [["admin", "จัดการร้าน", Settings]] : []),
  ];

  const guideCustomer = [
    {
      title: "ตรวจสอบสถานะร้าน",
      icon: Store,
      description: "ก่อนจองคิว ให้ตรวจสอบสถานะร้านที่หน้าแรก หากร้านปิดให้บริการ จะยังไม่สามารถส่งรายการจองใหม่ได้",
      steps: ["เข้าสู่หน้าแรกของเว็บไซต์", "ดูแถบสถานะร้าน", "หากร้านเปิดให้บริการ สามารถกดจองคิวได้"],
    },
    {
      title: "เลือกรูปแบบการใช้บริการ",
      icon: Truck,
      description: "ลูกค้าสามารถเลือกนำผ้ามาส่งเอง หรือเรียกให้ร้านไปรับผ้าและนำไปส่งคืน",
      steps: ["เลือกเมนูจองคิว", "เลือกนำผ้ามาส่งที่ร้าน หรือเรียกให้ร้านไปรับ", "กรณีเรียกรับผ้า ให้กรอกที่อยู่ วันและเวลาที่สะดวก"],
    },
    {
      title: "กรอกข้อมูลลูกค้า",
      icon: User,
      description: "กรอกชื่อและเบอร์โทรศัพท์เพื่อให้ร้านติดต่อกลับและใช้ค้นหาประวัติการใช้บริการ",
      steps: ["กรอกชื่อผู้ใช้บริการ", "กรอกเบอร์โทรศัพท์ที่ติดต่อได้", "ตรวจสอบความถูกต้องก่อนดำเนินการต่อ"],
    },
    {
      title: "เลือกประเภทผ้า",
      icon: Shirt,
      description: "เลือกชนิดผ้าที่ต้องการส่งซัก พร้อมระบุจำนวนของแต่ละประเภท",
      steps: ["ดูรายการประเภทผ้าที่ร้านรับบริการ", "กดปุ่มบวกเพื่อเพิ่มจำนวน", "กดปุ่มลบเพื่อลดจำนวน", "ตรวจสอบรายการและยอดรวม"],
    },
    {
      title: "เลือกบริการซัก อบ และรีด",
      icon: Sparkles,
      description: "ลูกค้าสามารถเลือกหรือยกเลิกบริการซัก อบ และรีดได้ตามต้องการ โดยระบบจะคำนวณราคาใหม่ตามบริการที่เลือก",
      steps: ["ติ๊กเลือกหรือยกเลิกบริการซักได้", "เลือกบริการอบหรือรีดเพิ่มเติมได้", "ตรวจสอบยอดรวมหลังเปลี่ยนบริการ", "พิมพ์หมายเหตุ เช่น แยกผ้าสี หรือไม่ใช้น้ำยาปรับผ้านุ่ม"],
    },
    {
      title: "เลือกวิธีชำระเงินและยืนยัน",
      icon: CreditCard,
      description: "เลือกวิธีชำระเงินที่ต้องการ จากนั้นตรวจสอบข้อมูลและยืนยันการจอง",
      steps: ["เลือกโอนเงินก่อนส่งคืน หรือชำระตอนรับผ้าคืน", "ตรวจสอบรายการผ้าและยอดรวม", "กดยืนยันการจองคิว", "รอร้านดำเนินการตามรายการ"],
    },
  ];

  const guideAdmin = [
    {
      title: "จัดการสถานะเปิด–ปิดร้าน",
      icon: Store,
      description: "เจ้าของร้านสามารถประกาศเปิดหรือปิดร้านชั่วคราวได้ตามสถานการณ์",
      steps: ["เข้าเมนูผู้ดูแลระบบ", "เลือกสถานะร้าน", "เลือกเปิดให้บริการหรือปิดชั่วคราว", "ระบุเหตุผลและข้อความแจ้งลูกค้า", "บันทึกสถานะ"],
    },
    {
      title: "จัดการประเภทผ้าและรูปภาพ",
      icon: Shirt,
      description: "เพิ่มประเภทผ้า กำหนดราคา และอัปโหลดรูปภาพจริงเพื่อให้ลูกค้าเห็นในหน้าเว็บไซต์",
      steps: ["เลือกเมนูจัดการประเภทผ้า", "กรอกชื่อและราคา", "เลือกหมวดหมู่", "เลือกรูปภาพจากคอมพิวเตอร์", "กดเพิ่มประเภทผ้า", "หากต้องการแก้ไขให้กดปุ่มแก้ไข"],
    },
    {
      title: "จัดการรายการจอง",
      icon: ClipboardList,
      description: "ตรวจสอบข้อมูลลูกค้า รายการผ้า วิธีรับส่ง และรายละเอียดงานแต่ละรายการ",
      steps: ["เข้าเมนูจัดการรายการจอง", "เลือกรายการที่ต้องการตรวจสอบ", "ดูข้อมูลลูกค้าและรายการผ้า", "เปลี่ยนสถานะงานตามขั้นตอนจริง", "บันทึกข้อมูลที่เกี่ยวข้อง"],
    },
    {
      title: "บันทึกภาพตำหนิและภาพส่งคืน",
      icon: Camera,
      description: "บันทึกภาพเพื่อเป็นหลักฐานประกอบการรับและส่งคืนผ้า",
      steps: ["ตรวจดูผ้าตอนรับเข้าร้าน", "ถ่ายภาพเฉพาะชิ้นที่มีตำหนิอยู่ก่อนแล้ว เช่น รอยขาดหรือรอยเปื้อน", "ไม่จำเป็นต้องถ่ายภาพผ้าทุกชิ้น", "เมื่อส่งคืนให้ถ่ายภาพหลักฐานการส่งคืน", "บันทึกวันและเวลาส่งคืน"],
    },
    {
      title: "จัดการผลิตภัณฑ์ซักรีด",
      icon: Package,
      description: "บันทึกผลิตภัณฑ์ที่ร้านใช้ เช่น น้ำยาซักผ้า น้ำยาปรับผ้านุ่ม และผลิตภัณฑ์ขจัดคราบ",
      steps: ["เข้าเมนูผลิตภัณฑ์ซักรีด", "เพิ่มชื่อ ยี่ห้อ ประเภท กลิ่น และราคา", "แก้ไขหรือลบข้อมูลได้", "เลือกผลิตภัณฑ์ที่ใช้ในรายละเอียดงานแต่ละรายการ"],
    },
    {
      title: "ตรวจสอบประวัติลูกค้าและการชำระเงิน",
      icon: History,
      description: "ค้นหาลูกค้าและดูรายการใช้บริการย้อนหลังจากเบอร์โทรศัพท์",
      steps: ["เข้าเมนูประวัติลูกค้า", "ค้นหาด้วยชื่อหรือเบอร์โทรศัพท์", "เลือกชื่อลูกค้าที่ต้องการ", "ตรวจสอบประวัติและยอดชำระสะสม", "อัปเดตสถานะการชำระเงินในรายละเอียดรายการจอง"],
    },
  ];

  return (
    <div className="app" style={{
      "--theme-page-bg": theme.pageBg,
      "--theme-surface": theme.surface,
      "--theme-accent-bg": theme.accentBg,
      "--theme-border": theme.border,
      "--theme-nav-bg": theme.navBg,
      "--theme-nav-opacity": `${theme.navOpacity}%`,
      "--theme-primary": theme.primary,
      "--theme-heading": theme.heading,
      "--theme-text": theme.text,
      "--theme-muted": theme.muted,
      "--theme-font-size": `${theme.fontSize}px`,
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Prompt:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; background: #f5f8fc; color: #203047; font-family: 'Prompt',sans-serif; }
        button,input,select,textarea { font: inherit; }
        button { cursor: pointer; }
        .app { min-height: 100vh; }
        .container { width: min(1240px,calc(100% - 40px)); margin: auto; }
        .topbar { background: white; border-bottom: 1px solid #e7edf5; position: sticky; top: 0; z-index: 20; }
        .nav { min-height: 76px; display: flex; align-items: center; justify-content: space-between; gap: 20px; }
        .brand { display: flex; align-items: center; gap: 11px; cursor: pointer; flex-shrink: 0; }
        .brand-icon { width: 46px; height: 46px; display: grid; place-items: center; color: white; border-radius: 14px; background: linear-gradient(135deg,#2788e8,#53b6ef); }
        .brand-name { font-size: 20px; font-weight: 700; color: #1d4e80; }
        .brand-sub { font-size: 11px; color: #8090a5; }
        .nav-links { display: flex; align-items: center; gap: 4px; }
        .nav-link { display: flex; align-items: center; gap: 6px; border: 0; background: transparent; color: #63748a; padding: 11px 12px; border-radius: 10px; font-size: 13px; white-space: nowrap; }
        .nav-link:hover,.nav-link.active { background: #edf6ff; color: #1675c9; }
        .menu-button { display: none; border: 0; background: #edf6ff; color: #1675c9; padding: 11px; border-radius: 10px; }
        .page { padding: 32px 0 65px; }
        .hero { padding: 45px; border-radius: 25px; background: linear-gradient(115deg,#e5f3ff,#f3faff 60%,#eaf8ff); display: grid; grid-template-columns: 1.35fr .65fr; gap: 25px; align-items: center; overflow: hidden; }
        .hero h1 { font-size: clamp(30px,4vw,45px); line-height: 1.4; color: #174d7f; margin: 12px 0; }
        .hero p { color: #617991; font-size: 15px; line-height: 1.9; max-width: 650px; }
        .hero-visual { min-height: 220px; display: grid; place-items: center; color: #4b9bdd; }
        .hero-visual svg { width: 170px; height: 170px; stroke-width: 1.2; }
        .eyebrow { color: #2487d3; font-size: 12px; font-weight: 600; letter-spacing: .5px; }
        .button { border: 0; border-radius: 11px; padding: 12px 18px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; font-weight: 600; font-size: 13px; transition: .2s; }
        .button:disabled { opacity: .5; cursor: not-allowed; }
        .primary { color: white; background: #2386d5; }
        .primary:hover { background: #176fb8; }
        .secondary { color: #247ac0; background: #eaf5ff; }
        .outline { color: #4e6781; background: white; border: 1px solid #dce6f0; }
        .danger { color: #c34c4c; background: #fff0f0; }
        .small-button { padding: 8px 11px; font-size: 12px; }
        .section { margin-top: 34px; }
        .section-head { display: flex; justify-content: space-between; align-items: center; gap: 15px; margin-bottom: 18px; }
        .section-head h2,.page-title { margin: 0; color: #254b70; font-size: 24px; }
        .section-head p { margin: 5px 0 0; color: #8392a5; font-size: 13px; }
        .grid-3 { display: grid; grid-template-columns: repeat(3,1fr); gap: 17px; }
        .grid-2 { display: grid; grid-template-columns: repeat(2,1fr); gap: 17px; }
        .card { background: white; border: 1px solid #e8eef5; border-radius: 17px; padding: 21px; box-shadow: 0 5px 18px rgba(30,70,110,.035); }
        .feature-icon { width: 47px; height: 47px; border-radius: 14px; background: #eaf5ff; color: #2386d5; display: grid; place-items: center; margin-bottom: 13px; }
        .card h3 { margin: 0 0 8px; font-size: 16px; color: #315675; }
        .muted { color: #8190a3; font-size: 12px; line-height: 1.8; }
        .shop-status { display: flex; align-items: flex-start; justify-content: space-between; gap: 18px; padding: 21px 23px; border-radius: 17px; margin-bottom: 24px; }
        .shop-status.open { background: #eaf8f0; border: 1px solid #ccebd9; }
        .shop-status.closed { background: #fff1f0; border: 1px solid #f2d2ce; }
        .status-main { display: flex; gap: 13px; align-items: flex-start; }
        .status-main h3 { margin: 0 0 4px; font-size: 17px; }
        .status-main p { margin: 0; font-size: 12px; color: #687d8d; line-height: 1.8; }
        .status-pill { display: inline-flex; padding: 6px 11px; border-radius: 30px; font-size: 11px; font-weight: 600; white-space: nowrap; }
        .status-pill.green { color: #218451; background: #d7f2e2; }
        .status-pill.red { color: #c04c48; background: #ffe0de; }
        .status-pill.blue { color: #2478bd; background: #e1f0ff; }
        .status-pill.orange { color: #a96b19; background: #fff0d7; }
        .product-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; }
        .product-card { overflow: hidden; padding: 0; }
        .product-visual { height: 155px; background: #edf6ff; display: grid; place-items: center; color: #70a9d7; overflow: hidden; }
        .product-visual svg { width: 55px; height: 55px; stroke-width: 1.4; }
        .product-visual img { width: 100%; height: 100%; object-fit: cover; }
        .product-info { padding: 15px; }
        .product-info h3 { margin: 0 0 5px; font-size: 15px; }
        .price { color: #2185d4; font-weight: 700; font-size: 17px; }
        .form-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 15px; }
        .field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 14px; }
        .field label { color: #536b83; font-size: 12px; font-weight: 500; }
        .field input,.field select,.field textarea,.search-input { width: 100%; border: 1px solid #dce5ef; border-radius: 10px; padding: 12px 13px; background: white; color: #30465c; outline: none; font-size: 13px; }
        .field input:focus,.field select:focus,.field textarea:focus,.search-input:focus { border-color: #6cb3eb; box-shadow: 0 0 0 3px #e8f4ff; }
        .field textarea { min-height: 85px; resize: vertical; }
        .field input[type=file] { padding: 9px; background: #f8fbff; }
        .choice-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 13px; }
        .choice { border: 1px solid #dce6f0; background: white; border-radius: 14px; padding: 16px; display: flex; align-items: flex-start; gap: 11px; text-align: left; color: #4c657e; }
        .choice.selected { border: 2px solid #3694df; background: #f0f8ff; padding: 15px; }
        .choice h3 { margin: 0 0 5px; font-size: 14px; }
        .choice p { margin: 0; font-size: 11px; color: #8190a3; line-height: 1.7; }
        .quantity-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; border: 1px solid #e5edf4; border-radius: 13px; padding: 12px; background: #fff; min-width: 0; }
        .quantity-controls { display: flex; align-items: center; gap: 7px; flex-shrink: 0; }
        .quantity-controls button { width: 34px; height: 34px; border: 0; border-radius: 10px; background: #edf6ff; color: #237fc7; display: grid; place-items: center; cursor: pointer; }
        .quantity-controls button:disabled { opacity: .38; cursor: not-allowed; }
        .quantity-input { width: 48px; height: 34px; border: 1px solid #dce8f2; border-radius: 9px; text-align: center; color: #244f70; font-weight: 700; font-size: 14px; outline: none; }
        .quantity-input:focus { border-color: #55a3df; box-shadow: 0 0 0 3px #e8f4ff; }
        .clothing-tools { display: grid; gap: 12px; margin: 14px 0; }
        .clothing-categories { display: flex; flex-wrap: wrap; gap: 7px; }
        .category-chip { border: 1px solid #dce7f0; background: #fff; color: #58728a; border-radius: 999px; padding: 8px 13px; font-size: 12px; cursor: pointer; }
        .category-chip.active { background: #eaf5ff; border-color: #78b7e5; color: #176fae; font-weight: 700; }
        .clothing-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
        .clothing-empty { padding: 22px; border: 1px dashed #cbdbe8; border-radius: 12px; text-align: center; color: #8194a5; font-size: 13px; }
        .clothing-summary { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 10px; margin-top: 14px; padding: 13px 15px; background: #eff7fd; border-radius: 12px; color: #456780; font-size: 13px; }
        @media(max-width:650px) { .clothing-grid { grid-template-columns: 1fr; } .quantity-row { padding: 10px; } }
        .check-row { display: flex; align-items: center; gap: 9px; border: 1px solid #e3ebf3; border-radius: 11px; padding: 12px; color: #526a82; font-size: 13px; }
        .check-row input { width: 16px; height: 16px; accent-color: #2386d5; }
        .summary { background: #f1f8ff; border-radius: 14px; padding: 17px; }
        .summary-line { display: flex; justify-content: space-between; gap: 14px; margin: 8px 0; color: #637991; font-size: 12px; }
        .summary-total { border-top: 1px solid #dbeaf7; padding-top: 12px; margin-top: 12px; color: #1c6eaf; font-size: 18px; font-weight: 700; }
        .admin-layout { display: grid; grid-template-columns: 220px 1fr; gap: 18px; align-items: start; }
        .admin-menu { display: flex; flex-direction: column; gap: 5px; }
        .admin-menu button { display: flex; align-items: center; gap: 9px; border: 0; background: transparent; color: #61758b; text-align: left; padding: 12px; border-radius: 10px; font-size: 12px; }
        .admin-menu button.active,.admin-menu button:hover { background: #eaf5ff; color: #1679c5; }
        .admin-content { min-width: 0; }
        .admin-content h2 { margin: 0 0 17px; color: #315675; font-size: 20px; }
        .table-wrap { overflow-x: auto; }
        table { width: 100%; border-collapse: collapse; min-width: 620px; }
        th,td { padding: 12px 10px; border-bottom: 1px solid #edf1f5; text-align: left; font-size: 12px; vertical-align: middle; }
        th { color: #74879a; font-weight: 500; background: #f8fbfe; }
        td { color: #52677d; }
        .customer-row { display: flex; justify-content: space-between; align-items: center; gap: 13px; padding: 14px 0; border-bottom: 1px solid #edf1f5; }
        .customer-avatar { width: 43px; height: 43px; border-radius: 13px; background: #eaf5ff; color: #2386d5; display: grid; place-items: center; flex-shrink: 0; }
        .detail-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 11px; }
        .stat { background: #f5f9fd; border-radius: 12px; padding: 14px; }
        .stat small { display: block; color: #8392a5; font-size: 11px; }
        .stat strong { display: block; color: #286eaa; font-size: 19px; margin-top: 5px; }
        .image-preview { width: 100%; max-height: 200px; object-fit: contain; border-radius: 11px; background: #f1f6fb; margin-top: 8px; }
        .notice { position: fixed; bottom: 22px; left: 50%; transform: translateX(-50%); z-index: 50; background: #244e72; color: white; padding: 12px 20px; border-radius: 11px; box-shadow: 0 8px 30px #183c5b33; font-size: 13px; max-width: calc(100% - 30px); text-align: center; }
        .footer { background: #eaf3fb; padding: 28px 0; color: #71869a; font-size: 12px; text-align: center; }
        .divider { border: 0; border-top: 1px solid #edf1f5; margin: 19px 0; }
        .empty { text-align: center; padding: 32px 15px; color: #8a9aac; }
        .empty svg { margin-bottom: 10px; color: #9abbd7; }
        .tag { display: inline-flex; padding: 5px 9px; border-radius: 8px; background: #f0f6fc; color: #67829a; font-size: 10px; }
        .section-note { padding: 12px 14px; background: #f3f8fd; color: #71879c; border-radius: 10px; font-size: 11px; line-height: 1.8; }
        .guide-tabs { display: flex; gap: 9px; margin: 20px 0; flex-wrap: wrap; }
        .guide-tabs button { border: 1px solid #dce6f0; background: white; color: #60778d; padding: 11px 17px; border-radius: 11px; font-size: 13px; display: flex; align-items: center; gap: 8px; }
        .guide-tabs button.active { background: #eaf5ff; color: #1979c4; border-color: #abd4f3; }
        .guide-intro { background: linear-gradient(110deg,#eaf5ff,#f6fbff); padding: 23px; border-radius: 15px; margin-bottom: 20px; }
        .guide-intro h2 { margin: 0 0 7px; color: #285c88; font-size: 20px; }
        .guide-card { display: grid; grid-template-columns: 54px 1fr; gap: 14px; margin-bottom: 13px; }
        .guide-icon { width: 52px; height: 52px; border-radius: 14px; display: grid; place-items: center; color: #2786ce; background: #eaf5ff; }
        .guide-card h3 { margin: 0 0 5px; color: #315675; font-size: 15px; }
        .guide-card p { margin: 0 0 10px; color: #7a8da1; font-size: 12px; line-height: 1.8; }
        .guide-steps { padding-left: 20px; margin: 0; color: #536d84; font-size: 12px; line-height: 2; }
        .guide-steps li::marker { color: #2786ce; font-weight: 700; }
        @media(max-width:1050px) {
          .nav-links { display: none; }
          .menu-button { display: inline-flex; }
          .nav-links.mobile-open { display: flex; position: absolute; top: 76px; left: 0; right: 0; background: white; padding: 13px 20px; flex-direction: column; align-items: stretch; border-bottom: 1px solid #e7edf5; }
          .nav-link { justify-content: flex-start; }
          .hero { padding: 32px; grid-template-columns: 1fr .4fr; }
          .product-grid { grid-template-columns: repeat(2,1fr); }
          .admin-layout { grid-template-columns: 1fr; }
          .admin-menu { display: grid; grid-template-columns: repeat(3,1fr); }
          .admin-menu button { justify-content: center; }
        }
        @media(max-width:650px) {
          .container { width: min(100% - 26px,1240px); }
          .page { padding-top: 22px; }
          .hero { grid-template-columns: 1fr; padding: 24px; }
          .hero-visual { min-height: 90px; }
          .hero-visual svg { width: 95px; height: 95px; }
          .grid-3,.grid-2,.form-grid,.choice-grid { grid-template-columns: 1fr; }
          .product-grid { grid-template-columns: repeat(2,1fr); gap: 10px; }
          .product-visual { height: 120px; }
          .card { padding: 16px; }
          .shop-status { flex-direction: column; }
          .section-head { align-items: flex-start; flex-direction: column; }
          .admin-menu { grid-template-columns: repeat(2,1fr); }
          .detail-grid { grid-template-columns: 1fr; }
          .brand-name { font-size: 18px; }
          .guide-card { grid-template-columns: 43px 1fr; gap: 10px; }
          .guide-icon { width: 42px; height: 42px; }
        }
        /* DEMO Laundry refresh: calm blue palette, readable type and glass navigation */
        body { background: #edf3f8; color: #263b50; }
        .app { background: radial-gradient(circle at 12% 5%, rgba(201,225,243,.38), transparent 28%), #edf3f8; }
        .topbar { background: rgba(235, 244, 251, .78); border-bottom: 1px solid rgba(255,255,255,.72); backdrop-filter: blur(18px) saturate(145%); -webkit-backdrop-filter: blur(18px) saturate(145%); box-shadow: 0 8px 26px rgba(43,76,105,.08); }
        .nav { min-height: 78px; }
        .nav-links { gap: 7px; }
        .nav-link { background: rgba(255,255,255,.48); border: 1px solid rgba(255,255,255,.55); color: #405d76; padding: 11px 14px; border-radius: 12px; font-size: 14px; font-weight: 500; transition: .2s ease; }
        .nav-link:hover { background: rgba(255,255,255,.88); transform: translateY(-1px); box-shadow: 0 5px 14px rgba(44,91,130,.10); }
        .nav-link.active { background: rgba(210,231,247,.9); border-color: rgba(151,194,224,.75); color: #185f91; box-shadow: inset 0 0 0 1px rgba(255,255,255,.55); }
        .menu-button { background: rgba(255,255,255,.72); border: 1px solid rgba(255,255,255,.8); }
        .nav-actions { display: flex; align-items: center; gap: 10px; }
        .account-chip { display: inline-flex; align-items: center; gap: 7px; color: #42627d; background: rgba(255,255,255,.58); border: 1px solid rgba(255,255,255,.8); border-radius: 999px; padding: 8px 12px; font-size: 12px; white-space: nowrap; }
        .logout-button { border: 1px solid #c8dce9; color: #42627d; background: rgba(255,255,255,.72); border-radius: 11px; padding: 9px 12px; display: inline-flex; align-items: center; gap: 7px; font-size: 13px; font-weight: 600; }
        .logout-button:hover { background: white; color: #1b679d; }
        .nav-links.mobile-open { background: rgba(235,244,251,.91); backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px); border-bottom: 1px solid rgba(255,255,255,.85); box-shadow: 0 14px 24px rgba(43,76,105,.10); }
        .hero { background: linear-gradient(115deg,#dcebf5,#eaf3f8 62%,#e2eff6); box-shadow: 0 12px 32px rgba(56,93,124,.08); }
        .card { background: rgba(255,255,255,.94); border-color: #dce7ef; box-shadow: 0 7px 22px rgba(44,76,103,.055); }
        .muted { color: #62798e; font-size: 13px; }
        .field label { color: #405d76; font-size: 14px; font-weight: 600; }
        .field input,.field select,.field textarea,.search-input { color: #263f55; font-size: 14px; }
        .button { font-size: 14px; }
        .small-button { font-size: 13px; }
        .check-row { font-size: 14px; min-height: 56px; cursor: pointer; background: #f8fbfd; }
        .check-row input { width: 18px; height: 18px; cursor: pointer; }
        .quantity { font-size: 15px; }
        th,td { font-size: 13px; }
        .customer-queue-list { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; max-width: 520px; }
        .queue-chip { display: inline-flex; align-items: center; border-radius: 8px; padding: 5px 9px; background: #e7f1f8; color: #245f8b; border: 1px solid #d0e2ee; font-size: 12px; font-weight: 700; letter-spacing: .2px; }
        .login-shell { min-height: 100vh; display: grid; place-items: center; padding: 28px 16px; background: radial-gradient(circle at 15% 15%, #d8eaf5 0, transparent 30%), radial-gradient(circle at 85% 85%, #dcecf4 0, transparent 28%), linear-gradient(135deg,#edf3f7,#e5eef5); }
        .login-card { width: min(460px,100%); padding: 34px; border-radius: 25px; background: rgba(255,255,255,.88); border: 1px solid rgba(255,255,255,.9); box-shadow: 0 22px 60px rgba(48,82,109,.13); backdrop-filter: blur(14px); }
        .login-logo { width: 66px; height: 66px; border-radius: 20px; display: grid; place-items: center; color: white; background: linear-gradient(145deg,#4b91bd,#79b1d0); margin: 0 auto 17px; box-shadow: 0 9px 20px rgba(67,132,174,.22); }
        .login-title { color: #244f70; font-size: 26px; text-align: center; margin: 0; }
        .login-subtitle { color: #637d91; text-align: center; font-size: 14px; margin: 7px 0 24px; }
        .login-account { background: #eef5f9; border: 1px solid #dce8ef; border-radius: 13px; padding: 13px 15px; color: #506c82; font-size: 13px; line-height: 1.9; margin-top: 17px; }
        .login-error { background: #fff0ef; color: #ad4d49; border: 1px solid #f1d1ce; border-radius: 10px; padding: 10px 12px; font-size: 13px; margin-bottom: 14px; }
        .login-footer { text-align: center; color: #8194a5; font-size: 12px; margin-top: 18px; }
        .auth-switch { text-align: center; margin-top: 16px; color: #637d91; font-size: 14px; }
        .auth-link { border: 0; background: transparent; color: #367eaa; font-weight: 700; cursor: pointer; padding: 5px 7px; }
        .auth-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 0 12px; }
        .auth-error { background: #fff0ef; color: #ad4d49; border: 1px solid #f1d1ce; border-radius: 10px; padding: 10px 12px; font-size: 13px; margin-bottom: 14px; }
        @media (max-width: 520px) { .auth-form-grid { grid-template-columns: 1fr; } }
        @media(max-width:1050px) {
          .nav { flex-wrap: wrap; }
          .nav-actions { margin-left: auto; }
          .nav-links.mobile-open { top: 78px; }
        }
        @media(max-width:650px) {
          .login-card { padding: 25px 20px; }
          .account-chip { display: none; }
          .nav-actions { gap: 6px; }
          .logout-button { padding: 8px 9px; font-size: 12px; }
          .nav-links.mobile-open { top: 76px; }
          .customer-row { align-items: flex-start; }
        }
        /* Final visual polish: accessible contrast, comfortable typography and subtle glass UI */
        body { font-family: 'Prompt', sans-serif; background: #eaf1f6; color: #263d52; font-size: 15px; }
        .app { min-height: 100vh; background: radial-gradient(ellipse at 12% 0%, rgba(191,218,237,.42), transparent 32%), radial-gradient(ellipse at 92% 30%, rgba(210,229,241,.30), transparent 28%), #eaf1f6; }
        .topbar { background: rgba(218,232,243,.68); border-bottom: 1px solid rgba(255,255,255,.78); backdrop-filter: blur(22px) saturate(150%); -webkit-backdrop-filter: blur(22px) saturate(150%); box-shadow: 0 7px 24px rgba(43,76,105,.075); }
        .nav { gap: 12px; }
        .nav-links { gap: 8px; }
        .nav-link { min-height: 44px; padding: 10px 14px; background: rgba(255,255,255,.55); border: 1px solid rgba(255,255,255,.72); color: #38566f; font-size: 14px; font-weight: 600; box-shadow: 0 2px 8px rgba(46,78,103,.035); }
        .nav-link:hover { background: rgba(255,255,255,.92); color: #175f91; transform: translateY(-1px); }
        .nav-link.active { background: rgba(190,218,238,.88); color: #174f79; border-color: rgba(125,174,207,.72); box-shadow: inset 0 0 0 1px rgba(255,255,255,.6), 0 4px 12px rgba(49,101,140,.08); }
        .nav-actions { gap: 8px; }
        .account-chip { color: #31536d; background: rgba(255,255,255,.62); font-size: 13px; }
        .logout-button { min-height: 40px; background: rgba(255,255,255,.62); font-size: 13px; }
        .menu-button { border-radius: 12px; color: #315b78; background: rgba(255,255,255,.72); }
        .page { padding-top: 32px; padding-bottom: 48px; }
        .page-title { color: #244b68; letter-spacing: -.25px; }
        h1,h2,h3 { letter-spacing: -.15px; }
        h2 { color: #2b526f; }
        p, .muted { color: #5f778c; line-height: 1.75; }
        .muted { font-size: 14px; }
        .card { border: 1px solid #d8e4ed; background: rgba(255,255,255,.94); border-radius: 18px; box-shadow: 0 9px 26px rgba(44,76,103,.06); }
        .button { min-height: 40px; border-radius: 11px; font-weight: 600; transition: transform .18s ease, box-shadow .18s ease, background .18s ease; }
        .button:hover { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(42,91,128,.12); }
        .field label { color: #38566e; font-size: 14px; font-weight: 600; }
        .field input,.field select,.field textarea,.search-input { color: #263f55; font-size: 14px; border-color: #d3e0e9; background: #fbfdff; }
        .field input::placeholder,.field textarea::placeholder,.search-input::placeholder { color: #91a2b1; }
        .field-hint { color: #71889b; font-size: 12px; line-height: 1.6; }
        .check-row.service-option { min-height: 76px; padding: 14px 15px; background: #f8fbfd; border: 1px solid #dbe6ee; border-radius: 14px; transition: .18s ease; }
        .check-row.service-option.selected { background: #eaf4fb; border-color: #8ebbd9; box-shadow: inset 0 0 0 1px rgba(105,164,201,.18); color: #245675; }
        .check-row.service-option input { width: 19px; height: 19px; accent-color: #397fa9; flex-shrink: 0; }
        .check-row.service-option span { color: #31536c; font-size: 14px; font-weight: 600; }
        .check-row.service-option small { color: #6f879a !important; font-size: 12px; font-weight: 400; }
        .customer-row { padding: 17px 15px; margin: 10px 0; border: 1px solid #dce7ef; border-radius: 15px; background: rgba(255,255,255,.88); align-items: center; }
        .customer-queue-heading { margin-top: 8px; color: #58758b; font-size: 12px; font-weight: 700; }
        .customer-queue-list { display: flex; flex-wrap: wrap; gap: 7px; margin-top: 7px; max-width: 560px; }
        .queue-chip { display: inline-flex; align-items: center; gap: 7px; border-radius: 9px; padding: 7px 10px; background: #e6f1f8; color: #1f5d85; border: 1px solid #c8dce9; font-size: 13px; font-weight: 700; letter-spacing: .25px; }
        .queue-dot { width: 7px; height: 7px; border-radius: 50%; background: #5794bb; }
        .hero { border: 1px solid rgba(255,255,255,.8); }
        .shop-status { border: 1px solid #d7e5ed; }
        .login-card { box-shadow: 0 22px 60px rgba(48,82,109,.12); }
        .auth-form-grid textarea { min-height: 84px; }
        .footer { background: rgba(222,235,244,.68); color: #637d91; }
        @media(max-width:1050px) {
          .nav { position: relative; }
          .nav-links.mobile-open { top: 78px; background: rgba(222,235,244,.93); border: 1px solid rgba(255,255,255,.8); border-radius: 0 0 16px 16px; }
          .nav-link { width: 100%; justify-content: flex-start; }
        }
        @media(max-width:650px) {
          .page { padding-top: 22px; }
          .nav-actions { margin-left: auto; }
          .customer-row { align-items: flex-start; flex-direction: column; }
          .customer-row > button { align-self: flex-end; }
          .queue-chip { font-size: 12px; }
        }
        /* User-adjustable theme variables */
        .app { background: var(--theme-page-bg) !important; color: var(--theme-text); font-size: var(--theme-font-size); }
        .topbar { background: color-mix(in srgb, var(--theme-nav-bg) var(--theme-nav-opacity), transparent) !important; }
        .card, .admin-content, .admin-menu, .login-card { background: var(--theme-surface) !important; border-color: var(--theme-border); }
        .feature-icon, .product-visual, .nav-link.active, .check-row.service-option.selected, .queue-chip, .secondary { background: var(--theme-accent-bg) !important; }
        .primary, .button.primary { background: var(--theme-primary) !important; }
        .app :is(.nav-link, .feature-icon, .queue-chip, .secondary) { border-color: var(--theme-border); }
        .page-title, .section-head h2, .card h3, h1, h2, h3 { color: var(--theme-heading); }
        .app p, .app label, .app .muted, .app .field-hint { color: var(--theme-muted); }
        .app input:not([type="color"]), .app select, .app textarea { color: var(--theme-text); }
        .app :is(p, label, input, select, textarea, button, td, th, li, .nav-link) { font-size: calc(var(--theme-font-size) * .93) !important; }
        .app :is(.muted, .field-hint, .brand-sub, .status-pill, .theme-color-control small, .theme-range-control small) { font-size: calc(var(--theme-font-size) * .78) !important; }
        .app :is(.page-title, h1) { font-size: calc(var(--theme-font-size) * 1.8) !important; }
        .app :is(h2, .section-head h2) { font-size: calc(var(--theme-font-size) * 1.5) !important; }
        .app h3 { font-size: calc(var(--theme-font-size) * 1.15) !important; }
        .app .theme-preview { border: 1px solid; border-radius: 16px; overflow: hidden; margin-bottom: 22px; }
        .app .theme-preview-nav { min-height: 54px; padding: 12px 16px; display: flex; justify-content: space-between; align-items: center; gap: 12px; backdrop-filter: blur(12px); }
        .app .theme-preview-nav span { font-size: 12px; }
        .app .theme-preview-card { margin: 14px; padding: 17px; border-radius: 12px; box-shadow: 0 4px 14px rgba(30,60,90,.07); }
        .app .theme-preview-card p { margin: 8px 0 13px; }
        .app .theme-control-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 10px; }
        .app .theme-color-control { min-width: 0; display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 13px; border: 1px solid #dce6ee; border-radius: 12px; background: var(--theme-surface); cursor: pointer; }
        .app .theme-color-control span { display: flex; flex-direction: column; gap: 3px; }
        .app .theme-color-control strong { color: var(--theme-heading); font-size: 13px; }
        .app .theme-color-control small { color: var(--theme-muted); font-size: 11px; font-weight: 400; }
        .app .theme-color-control input[type="color"] { width: 43px; height: 38px; padding: 3px; border: 1px solid #d3e0e9; border-radius: 9px; background: white; cursor: pointer; flex-shrink: 0; }
        .app .theme-range-control { margin-top: 18px; padding: 15px; border: 1px solid #dce6ee; border-radius: 12px; }
        .app .theme-range-control > div { display: flex; justify-content: space-between; gap: 12px; color: var(--theme-heading); font-size: 13px; }
        .app .theme-range-control input { width: 100%; margin: 13px 0 5px; accent-color: var(--theme-primary); }
        .app .theme-range-control small { color: var(--theme-muted); font-size: 11px; }
        @media(max-width:650px) { .app .theme-control-grid { grid-template-columns: 1fr; } .app .theme-preview-nav { align-items: flex-start; flex-direction: column; gap: 3px; } }
        /* Refined dashboard, queue preview and restrained micro-interactions */
        .app .card, .app .stat, .app .queue-chip, .app .button, .app .nav-link { transition: transform .18s ease, box-shadow .18s ease, background-color .18s ease, border-color .18s ease; }
        .app .card:hover { box-shadow: 0 12px 28px rgba(44,76,103,.085); }
        .app .product-card:hover { transform: translateY(-3px); }
        .app .button:not(:disabled):active, .app .nav-link:active { transform: scale(.98); }
        .app .dashboard-grid { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: 13px; margin: 14px 0 20px; }
        .app .dashboard-stat { position: relative; overflow: hidden; min-height: 126px; padding: 17px; border: 1px solid var(--theme-border); border-radius: 16px; background: var(--theme-surface); }
        .app .dashboard-stat::after { content: ''; position: absolute; width: 88px; height: 88px; right: -27px; bottom: -34px; border-radius: 50%; background: var(--theme-accent-bg); opacity: .8; }
        .app .dashboard-stat-top { display: flex; align-items: center; justify-content: space-between; gap: 8px; color: var(--theme-muted); font-size: 12px; }
        .app .dashboard-stat-icon { width: 38px; height: 38px; display: grid; place-items: center; border-radius: 12px; color: var(--theme-primary); background: var(--theme-accent-bg); }
        .app .dashboard-stat strong { display: block; position: relative; z-index: 1; margin-top: 12px; color: var(--theme-heading); font-size: 25px; line-height: 1.2; }
        .app .dashboard-stat small { display: block; margin-top: 4px; color: var(--theme-muted); font-size: 11px; }
        .app .dashboard-columns { display: grid; grid-template-columns: 1.1fr .9fr; gap: 14px; }
        .app .dashboard-list { display: grid; gap: 9px; }
        .app .dashboard-order { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 12px; border: 1px solid var(--theme-border); border-radius: 12px; background: color-mix(in srgb, var(--theme-surface) 88%, var(--theme-accent-bg)); }
        .app .dashboard-queue { color: var(--theme-primary); font-size: 14px; font-weight: 700; letter-spacing: .2px; }
        .app .dashboard-status-row { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--theme-border); color: var(--theme-text); font-size: 12px; }
        .app .dashboard-status-row:last-child { border-bottom: 0; }
        .app .booking-review { margin-top: 14px; padding: 16px; border: 1px solid var(--theme-border); border-radius: 14px; background: color-mix(in srgb, var(--theme-accent-bg) 55%, var(--theme-surface)); }
        .app .booking-review h3 { margin: 0 0 11px; color: var(--theme-heading); }
        .app .booking-review-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 9px 16px; }
        .app .booking-review-item { min-width: 0; color: var(--theme-muted); font-size: 12px; line-height: 1.7; overflow-wrap: anywhere; }
        .app .booking-review-item strong { display: block; color: var(--theme-text); font-size: 13px; font-weight: 600; }
        .app .queue-highlight { display: inline-flex; align-items: center; padding: 7px 11px; border-radius: 10px; background: var(--theme-accent-bg); color: var(--theme-primary); border: 1px solid var(--theme-border); font-weight: 800; letter-spacing: .3px; }
        .app .handover-preview { margin: 15px 0; padding: 16px; border: 1px solid var(--theme-border); border-radius: 14px; background: var(--theme-accent-bg); }
        .app .handover-preview-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 10px; }
        .app .handover-preview-title strong { color: var(--theme-heading); }
        .app .handover-preview p { margin: 5px 0; color: var(--theme-text); font-size: 12px; line-height: 1.8; }
        .app .footer { position: relative; overflow: hidden; border-top: 1px solid rgba(255,255,255,.75); }
        .app .footer strong { color: var(--theme-heading); font-size: 17px; }
        @media(max-width:900px) { .app .dashboard-grid { grid-template-columns: repeat(2,minmax(0,1fr)); } .app .dashboard-columns { grid-template-columns: 1fr; } }
        @media(max-width:650px) { .app .dashboard-grid { gap: 9px; } .app .dashboard-stat { min-height: 112px; padding: 13px; } .app .dashboard-stat strong { font-size: 21px; } .app .booking-review-grid { grid-template-columns: 1fr; } .app .dashboard-order { align-items: flex-start; flex-direction: column; } }
        @media(prefers-reduced-motion: reduce) { .app *, .app *::before, .app *::after { transition-duration: .01ms !important; animation-duration: .01ms !important; scroll-behavior: auto !important; } }

        /* Visual refresh: richer visual hierarchy, gentle motion and responsive polish */
        .app { position: relative; isolation: isolate; }
        .app::before { content: ""; position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: .42; background-image: radial-gradient(rgba(93,145,181,.15) .8px, transparent .8px); background-size: 24px 24px; mask-image: linear-gradient(to bottom,black,transparent 75%); }
        .container { max-width: 1280px; }
        .brand-icon { border-radius: 16px; background: linear-gradient(145deg,#397da7,#78b5d0); box-shadow: 0 8px 18px rgba(57,125,167,.22); }
        .brand-name { letter-spacing: -.5px; }
        .topbar { position: sticky; }
        .hero { position: relative; isolation: isolate; min-height: 330px; padding: clamp(28px,4vw,54px); border: 1px solid rgba(255,255,255,.88); background: linear-gradient(118deg,rgba(215,235,247,.98),rgba(239,247,251,.97) 58%,rgba(220,239,247,.98)); box-shadow: 0 18px 48px rgba(48,91,122,.10); }
        .hero::before { content: ""; position: absolute; width: 330px; height: 330px; border-radius: 50%; right: 9%; top: -190px; background: rgba(255,255,255,.38); z-index: -1; }
        .hero::after { content: ""; position: absolute; width: 190px; height: 190px; border-radius: 50%; right: 2%; bottom: -115px; background: rgba(150,198,222,.18); z-index: -1; }
        .hero h1 { font-size: clamp(32px,4.2vw,49px); line-height: 1.32; letter-spacing: -1.1px; }
        .hero p { font-size: 15px; max-width: 580px; }
        .hero-visual { position: relative; min-height: 250px; border-radius: 50%; width: min(100%,280px); justify-self: center; aspect-ratio: 1; background: radial-gradient(circle at 35% 28%,#fff 0,#edf7fc 42%,#d5e9f4 72%,#c4dfed 100%); border: 1px solid rgba(255,255,255,.9); box-shadow: inset 0 8px 22px rgba(255,255,255,.85),0 18px 42px rgba(67,119,151,.13); }
        .hero-visual::before,.hero-visual::after { content: ""; position: absolute; border-radius: 50%; border: 1px solid rgba(75,142,180,.17); }
        .hero-visual::before { inset: 14px; }
        .hero-visual::after { width: 24px; height: 24px; top: 28px; right: 28px; background: rgba(255,255,255,.8); box-shadow: -190px 120px 0 -7px rgba(255,255,255,.8),-155px -5px 0 -9px rgba(255,255,255,.8); }
        .hero-visual svg { width: 142px; height: 142px; stroke-width: 1.25; filter: drop-shadow(0 8px 8px rgba(55,111,146,.13)); animation: washer-float 4s ease-in-out infinite; }
        @keyframes washer-float { 0%,100% { transform: translateY(0) rotate(-2deg); } 50% { transform: translateY(-8px) rotate(2deg); } }
        .eyebrow { display: inline-flex; align-items: center; gap: 8px; padding: 7px 12px; border-radius: 999px; background: rgba(255,255,255,.65); border: 1px solid rgba(255,255,255,.9); letter-spacing: 1px; }
        .eyebrow::before { content: ""; width: 7px; height: 7px; border-radius: 50%; background: #65a8c8; box-shadow: 0 0 0 4px rgba(101,168,200,.13); }
        .button { box-shadow: 0 3px 10px rgba(46,92,124,.06); }
        .primary { background: linear-gradient(135deg,#397fa9,#579fc2); box-shadow: 0 7px 16px rgba(57,127,169,.2); }
        .primary:hover { background: linear-gradient(135deg,#2f719a,#468eb2); box-shadow: 0 10px 20px rgba(57,127,169,.25); }
        .secondary { background: rgba(255,255,255,.72); border: 1px solid rgba(151,190,213,.5); }
        .card { position: relative; overflow: hidden; transition: transform .22s ease,box-shadow .22s ease,border-color .22s ease; }
        .card:hover { transform: translateY(-4px); border-color: #c4dce9; box-shadow: 0 16px 34px rgba(44,89,120,.105); }
        .feature-icon { background: linear-gradient(145deg,#e8f4fa,#d9edf7); color: #397fa9; border: 1px solid rgba(255,255,255,.9); box-shadow: 0 5px 13px rgba(58,123,159,.08); }
        .section { margin-top: 42px; }
        .section-head h2,.page-title { letter-spacing: -.45px; }
        .section-head h2::after { content: ""; display: block; width: 38px; height: 3px; border-radius: 5px; margin-top: 9px; background: linear-gradient(90deg,#4e94b8,#b8d9e9); }
        .shop-status { border-radius: 16px; box-shadow: 0 7px 20px rgba(42,83,110,.045); }
        .product-card { border-radius: 18px; }
        .product-visual { background: linear-gradient(145deg,#edf6fa,#dcecf4); }
        .product-card:hover .product-visual img { transform: scale(1.045); }
        .product-visual img { transition: transform .35s ease; }
        .category-chip,.choice,.check-row,.quantity-row { transition: border-color .18s ease,background .18s ease,transform .18s ease,box-shadow .18s ease; }
        .category-chip:hover,.choice:hover { border-color: #9fc6dc; transform: translateY(-1px); }
        .quantity-row:hover { border-color: #c4dce9; box-shadow: 0 5px 14px rgba(52,96,126,.055); }
        .admin-menu button { min-height: 44px; transition: .18s ease; }
        .admin-menu button.active,.admin-menu button:hover { box-shadow: inset 3px 0 #5798bb; }
        .stat { border: 1px solid #e3edf3; background: linear-gradient(145deg,#f8fbfd,#eef5f9); }
        .table-wrap { border: 1px solid #e4edf3; border-radius: 13px; }
        th { background: #f2f7fa; }
        .notice { box-shadow: 0 12px 30px rgba(28,66,91,.2); }
        button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible { outline: 3px solid rgba(75,151,191,.25); outline-offset: 2px; }
        @media(max-width:650px) {
          .hero { min-height: 0; }
          .hero-visual { width: 190px; min-height: 190px; margin: 6px auto 0; }
          .hero-visual svg { width: 105px; height: 105px; }
          .section { margin-top: 32px; }
          .card:hover { transform: none; }
        }
        @media(prefers-reduced-motion:reduce) {
          *,*::before,*::after { scroll-behavior: auto !important; animation-duration: .01ms !important; animation-iteration-count: 1 !important; transition-duration: .01ms !important; }
        }
      `}</style>

      {!isAuthenticated ? (
        <main className="login-shell">
          <section className="login-card">
            <div className="login-logo"><WashingMachine size={34} /></div>
            <h1 className="login-title">DEMO Laundry</h1>
            <p className="login-subtitle">{authView === "login" ? "เข้าสู่ระบบเพื่อใช้บริการและจัดการร้าน" : "สมัครสมาชิกเพื่อเริ่มใช้บริการร้านซักอบรีด"}</p>
            {authView === "login" ? (
              <>
                <form onSubmit={handleLogin}>
                  <div className="field"><label>ชื่อผู้ใช้</label><input autoComplete="username" value={loginForm.username} onChange={(e) => setLoginForm((prev) => ({ ...prev, username: e.target.value }))} placeholder="กรอกชื่อผู้ใช้" required /></div>
                  <div className="field"><label>รหัสผ่าน</label><input type="password" autoComplete="current-password" value={loginForm.password} onChange={(e) => setLoginForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="กรอกรหัสผ่าน" required /></div>
                  {loginError && <div className="login-error">{loginError}</div>}
                  <button className="button primary" type="submit" style={{ width: "100%", marginTop: 7, padding: 14 }}><User size={17} /> เข้าสู่ระบบ</button>
                </form>
                <div className="auth-switch">ยังไม่มีบัญชีสมาชิก? <button className="auth-link" type="button" onClick={() => { setAuthView("register"); setLoginError(""); setRegisterError(""); }}>สมัครสมาชิก</button></div>
                <div className="login-account"><strong>บัญชีทดลองสำหรับนำเสนอ</strong><br />ลูกค้า: <strong>customer</strong> / รหัสผ่าน <strong>1234</strong><br />เจ้าของร้าน: <strong>admin</strong> / รหัสผ่าน <strong>1234</strong></div>
              </>
            ) : (
              <>
                <form onSubmit={handleRegister}>
                  <div className="auth-form-grid">
                    <div className="field"><label>ชื่อ-นามสกุล</label><input value={registerForm.name} onChange={(e) => setRegisterForm((prev) => ({ ...prev, name: e.target.value }))} placeholder="กรอกชื่อ-นามสกุล" required /></div>
                    <div className="field"><label>เบอร์โทรศัพท์</label><input type="tel" inputMode="numeric" maxLength={10} value={registerForm.phone} onChange={(e) => setRegisterForm((prev) => ({ ...prev, phone: e.target.value.replace(/\D/g, "").slice(0, 10) }))} placeholder="เช่น 0812345678" required /></div>
                    <div className="field" style={{ gridColumn: "1 / -1" }}><label>ที่อยู่สำหรับบริการรับผ้าถึงบ้าน</label><textarea value={registerForm.address} onChange={(e) => setRegisterForm((prev) => ({ ...prev, address: e.target.value }))} placeholder="บ้านเลขที่ หมู่บ้าน/อาคาร ถนน ตำบล อำเภอ จังหวัด และจุดสังเกต" required /></div>
                    <div className="field"><label>ชื่อผู้ใช้</label><input autoComplete="username" value={registerForm.username} onChange={(e) => setRegisterForm((prev) => ({ ...prev, username: e.target.value }))} placeholder="ภาษาอังกฤษ 4–20 ตัว" required /></div>
                    <div className="field"><label>รหัสผ่าน</label><input type="password" autoComplete="new-password" value={registerForm.password} onChange={(e) => setRegisterForm((prev) => ({ ...prev, password: e.target.value }))} placeholder="อย่างน้อย 4 ตัวอักษร" required /></div>
                    <div className="field" style={{ gridColumn: "1 / -1" }}><label>ยืนยันรหัสผ่าน</label><input type="password" autoComplete="new-password" value={registerForm.confirmPassword} onChange={(e) => setRegisterForm((prev) => ({ ...prev, confirmPassword: e.target.value }))} placeholder="กรอกรหัสผ่านอีกครั้ง" required /></div>
                  </div>
                  {registerError && <div className="auth-error">{registerError}</div>}
                  <button className="button primary" type="submit" style={{ width: "100%", marginTop: 7, padding: 14 }}><Users size={17} /> สมัครสมาชิก</button>
                </form>
                <div className="auth-switch">มีบัญชีสมาชิกอยู่แล้ว? <button className="auth-link" type="button" onClick={() => { setAuthView("login"); setRegisterError(""); }}>กลับไปเข้าสู่ระบบ</button></div>
              </>
            )}
            <p className="login-footer">DEMO VERSION · ระบบสมาชิกจำลองเพื่อการนำเสนอ</p>
          </section>
        </main>
      ) : (
      <>
      <header className="topbar">
        <div className="container nav">
          <div className="brand" onClick={() => goTo("home")}>
            <div className="brand-icon"><WashingMachine size={26} /></div>
            <div>
              <div className="brand-name">DEMO Laundry</div>
              <div className="brand-sub">ระบบจัดการร้านซักอบรีด</div>
            </div>
          </div>

          <button className="menu-button" onClick={() => setMobileMenu(!mobileMenu)}>
            <Menu size={22} />
          </button>

          <nav className={`nav-links ${mobileMenu ? "mobile-open" : ""}`}>
            {navItems.map(([id, label, Icon]) => (
              <button
                key={id}
                className={`nav-link ${page === id ? "active" : ""}`}
                onClick={() => goTo(id)}
              >
                <Icon size={16} /> {label}
              </button>
            ))}
          </nav>
          <div className="nav-actions">
            <span className="account-chip"><User size={14} /> {loggedInAs}</span>
            <button className="logout-button" onClick={handleLogout}><ArrowLeft size={15} /> ออกจากระบบ</button>
          </div>
        </div>
      </header>

      <main className="container page">
        {page === "home" && (
          <>
            <div className={`shop-status ${shopOpen ? "open" : "closed"}`}>
              <div className="status-main">
                <Store size={29} color={shopOpen ? "#26965e" : "#cf5b55"} />
                <div>
                  <h3>{shopOpen ? "ร้านเปิดให้บริการ" : "ร้านปิดให้บริการชั่วคราว"}</h3>
                  <p>{shopMessage}</p>
                  {!shopOpen && <p style={{ marginTop: 5 }}>เหตุผล: {shopReason}</p>}
                </div>
              </div>
              <span className={`status-pill ${shopOpen ? "green" : "red"}`}>
                {shopOpen ? "เปิดให้บริการ" : "ปิดให้บริการ"}
              </span>
            </div>

            <section className="hero">
              <div>
                <div className="eyebrow">WELCOME TO DEMO LAUNDRY</div>
                <h1>ดูแลเสื้อผ้าของคุณ<br />ให้สะอาด หอม สดชื่น</h1>
                <p>
                  บริการซัก อบ รีด พร้อมตัวเลือกนำผ้ามาส่งที่ร้าน
                  หรือเรียกให้ร้านไปรับผ้าถึงบ้านและนำไปส่งคืน
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 22 }}>
                  <button className="button primary" onClick={() => goTo("booking")} disabled={!shopOpen}>
                    <CalendarDays size={17} /> จองคิวใช้บริการ
                  </button>
                  <button className="button secondary" onClick={() => goTo("guide")}>
                    <BookOpen size={17} /> อ่านคู่มือ
                  </button>
                </div>
                {!shopOpen && <p style={{ color: "#c4514b" }}>ขณะนี้ร้านปิด จึงยังไม่สามารถจองคิวได้</p>}
              </div>
              <div className="hero-visual"><WashingMachine /></div>
            </section>

            <section className="section">
              <div className="section-head">
                <div>
                  <h2>เลือกรูปแบบการใช้บริการ</h2>
                  <p>เลือกวิธีใช้บริการได้ตามความสะดวก</p>
                </div>
              </div>
              <div className="grid-2">
                <div className="card">
                  <div className="feature-icon"><Store size={24} /></div>
                  <h3>นำผ้ามาส่งที่ร้าน</h3>
                  <p className="muted">ลูกค้านำผ้ามาที่ร้าน เลือกประเภทผ้าและบริการที่ต้องการ แล้วมารับคืนที่ร้าน</p>
                  <button className="button secondary" onClick={() => goTo("booking")}>จองบริการนี้ <ChevronRight size={15} /></button>
                </div>
                <div className="card">
                  <div className="feature-icon"><Truck size={24} /></div>
                  <h3>เรียกให้ร้านไปรับผ้า</h3>
                  <p className="muted">ลูกค้าแจ้งที่อยู่ วันและเวลาที่สะดวก ร้านเข้ารับผ้าและนำไปส่งคืน</p>
                  <button className="button secondary" onClick={() => {
                    setForm((prev) => ({ ...prev, method: "pickup" }));
                    goTo("booking");
                  }}>เรียกรับผ้า <ChevronRight size={15} /></button>
                </div>
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div><h2>บริการของเรา</h2><p>เลือกบริการที่ต้องการได้</p></div>
                <button className="button outline small-button" onClick={() => goTo("services")}>ดูทั้งหมด</button>
              </div>
              <div className="grid-3">
                {services.map((service) => {
                  const Icon = service.icon;
                  return (
                    <div className="card" key={service.id}>
                      <div className="feature-icon"><Icon size={24} /></div>
                      <h3>{service.name}</h3>
                      <p className="muted">{service.description}</p>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="section">
              <div className="section-head">
                <div><h2>ประเภทผ้าที่รับบริการ</h2><p>รายการตัวอย่างและราคาเริ่มต้น</p></div>
                <button className="button outline small-button" onClick={() => goTo("catalog")}>ดูทั้งหมด</button>
              </div>
              <div className="product-grid">
                {clothing.slice(0, 4).map((item) => (
                  <div className="card product-card" key={item.id}>
                    <div className="product-visual">
                      {item.image ? <img src={item.image} alt={item.name} /> : <Shirt />}
                    </div>
                    <div className="product-info">
                      <h3>{item.name}</h3>
                      <div className="price">ซัก {money(item.price)} บาท</div>
                      <p className="muted">รีด {money(item.ironingPrice ?? 0)} บาท/ชิ้น</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {products.length > 0 && (
              <section className="section">
                <div className="section-head">
                  <div><h2>ผลิตภัณฑ์ที่ร้านเลือกใช้</h2><p>ผลิตภัณฑ์และสูตรมาตรฐานที่ร้านใช้ดูแลเสื้อผ้า</p></div>
                </div>
                <div className="product-grid">
                  {products.map((product) => (
                    <div className="card product-card" key={product.id}>
                      <div className="product-visual">{product.image ? <img src={product.image} alt={product.name}/> : <Package/>}</div>
                      <div className="product-info"><span className="tag">{product.type}</span><h3 style={{ marginTop: 8 }}>{product.name}</h3><p className="muted">{product.brand || "ผลิตภัณฑ์ของร้าน"}{product.scent ? ` · ${product.scent}` : ""}</p><p className="muted">{product.description || "ผลิตภัณฑ์ที่ร้านเลือกใช้ในสูตรมาตรฐาน"}</p></div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {page === "services" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">OUR SERVICES</div>
                <h1 className="page-title">บริการของเรา</h1>
                <p className="muted">เลือกบริการที่ต้องการได้ในขั้นตอนการจองคิว</p>
              </div>
            </div>
            <div className="grid-3">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <div className="card" key={service.id}>
                    <div className="feature-icon"><Icon size={24} /></div>
                    <h3>{service.name}</h3>
                    <p className="muted">{service.description}</p>
                    <span className="tag">
                      {service.price ? `ตัวอย่าง +${service.price} บาท/ชิ้น` : "คิดราคาตามประเภทผ้า"}
                    </span>
                  </div>
                );
              })}
            </div>
            <section className="section">
              <h2 className="page-title">รูปแบบการรับผ้า</h2>
              <div className="grid-2" style={{ marginTop: 17 }}>
                <div className="card">
                  <div className="feature-icon"><Store size={24} /></div>
                  <h3>ลูกค้านำผ้ามาส่งเอง</h3>
                  <p className="muted">นำผ้ามาที่ร้านและมารับคืนที่ร้านเมื่อดำเนินการเสร็จ</p>
                </div>
                <div className="card">
                  <div className="feature-icon"><Truck size={24} /></div>
                  <h3>ร้านไปรับและส่งคืน</h3>
                  <p className="muted">ร้านเข้ารับผ้าตามที่อยู่ที่ลูกค้าแจ้ง และนำผ้าไปส่งคืน</p>
                </div>
              </div>
            </section>
          </>
        )}

        {page === "catalog" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">CLOTHING CATALOG</div>
                <h1 className="page-title">รายการประเภทผ้า</h1>
                <p className="muted">เลือกดูประเภทผ้าและราคาเบื้องต้นของร้าน</p>
              </div>
            </div>
            <div className="product-grid">
              {clothing.map((item) => (
                <div className="card product-card" key={item.id}>
                  <div className="product-visual">
                    {item.image ? <img src={item.image} alt={item.name} /> : <Shirt />}
                  </div>
                  <div className="product-info">
                    <span className="tag">{item.category}</span>
                    <h3 style={{ marginTop: 8 }}>{item.name}</h3>
                    <div className="price">ซัก {money(item.price)} บาท</div>
                    <p className="muted">รีด {money(item.ironingPrice ?? 0)} บาท/ชิ้น</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {page === "booking" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">BOOKING</div>
                <h1 className="page-title">จองคิวใช้บริการ</h1>
                <p className="muted">กรอกข้อมูล เลือกประเภทผ้าและบริการที่ต้องการ</p>
              </div>
            </div>

            {!shopOpen ? (
              <div className="card" style={{ textAlign: "center", padding: 40 }}>
                <Store size={42} color="#cc6159" />
                <h2 style={{ color: "#bd514b" }}>ร้านปิดให้บริการชั่วคราว</h2>
                <p className="muted">{shopMessage}</p>
                <p className="muted">เหตุผล: {shopReason}</p>
                <button className="button outline" onClick={() => goTo("home")}>กลับหน้าแรก</button>
              </div>
            ) : (
              <form onSubmit={submitBooking}>
                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 16px" }}>1. เลือกรูปแบบการใช้บริการ</h2>
                  <div className="choice-grid">
                    <button type="button" className={`choice ${form.method === "dropoff" ? "selected" : ""}`} onClick={() => updateForm("method", "dropoff")}>
                      <Store size={26} color="#2788d3" />
                      <div><h3>นำผ้ามาส่งที่ร้าน</h3><p>ลูกค้านำผ้ามาส่งและมารับคืนที่ร้าน</p></div>
                    </button>
                    <button type="button" className={`choice ${form.method === "pickup" ? "selected" : ""}`} onClick={() => updateForm("method", "pickup")}>
                      <Truck size={26} color="#2788d3" />
                      <div><h3>เรียกให้ร้านไปรับผ้า</h3><p>ร้านไปรับผ้าและนำไปส่งคืนให้ลูกค้า</p></div>
                    </button>
                  </div>

                  {form.method === "pickup" && (
                    <div style={{ marginTop: 18 }}>
                      <div className="section-note" style={{ marginBottom: 14 }}>
                        กรุณาระบุที่อยู่ วันและเวลาที่สะดวกให้ร้านเข้ารับผ้า
                      </div>
                      <div className="field">
                        <label>ที่อยู่สำหรับเข้ารับผ้าและส่งคืน *</label>
                        <textarea value={form.address} onChange={(e) => updateForm("address", e.target.value)} placeholder="บ้านเลขที่ ถนน ตำบล อำเภอ จังหวัด และจุดสังเกต" />
                        <small className="field-hint">ระบบจะเติมที่อยู่ที่บันทึกไว้ตอนสมัครสมาชิกให้อัตโนมัติ คุณสามารถแก้ไขที่อยู่เฉพาะรายการจองนี้ได้</small>
                      </div>
                      <div className="form-grid">
                        <div className="field">
                          <label>วันที่ต้องการให้เข้ารับผ้า *</label>
                          <input type="date" value={form.pickupDate} onChange={(e) => updateForm("pickupDate", e.target.value)} />
                        </div>
                        <div className="field">
                          <label>เวลาที่สะดวก *</label>
                          <input type="time" value={form.pickupTime} onChange={(e) => updateForm("pickupTime", e.target.value)} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>2. ข้อมูลลูกค้า</h2>
                  <div className="form-grid">
                    <div className="field">
                      <label>ชื่อผู้ใช้บริการ *</label>
                      <input value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="กรอกชื่อ-นามสกุล" />
                    </div>
                    <div className="field">
                      <label>เบอร์โทรศัพท์ *</label>
                      <input type="tel" value={form.phone} onChange={(e) => updateForm("phone", e.target.value)} placeholder="กรอกเบอร์โทรศัพท์" />
                    </div>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <div>
                      <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 5px" }}>3. เลือกประเภทผ้าและจำนวน</h2>
                      <p className="muted" style={{ margin: 0 }}>ค้นหาประเภทผ้า แล้วระบุจำนวนได้ทั้งปุ่มบวก-ลบหรือพิมพ์ตัวเลข</p>
                    </div>
                    <span style={{ background: "#eaf5ff", color: "#1976b9", borderRadius: 999, padding: "7px 12px", fontSize: 12, fontWeight: 700 }}>เลือกแล้ว {totalItems} ชิ้น</span>
                  </div>

                  <div className="clothing-tools">
                    <div style={{ position: "relative" }}>
                      <Search size={17} color="#8ba2b6" style={{ position: "absolute", left: 13, top: 13 }} />
                      <input className="search-input" value={clothingSearch} onChange={(e) => setClothingSearch(e.target.value)} placeholder="ค้นหาชื่อผ้า เช่น เสื้อยืด, ผ้าห่ม..." style={{ paddingLeft: 39 }} />
                      {clothingSearch && <button type="button" onClick={() => setClothingSearch("")} style={{ position: "absolute", right: 9, top: 8, border: 0, background: "transparent", color: "#789", padding: 5 }}><X size={16} /></button>}
                    </div>
                    <div className="clothing-categories">
                      {clothingCategories.map((category) => (
                        <button type="button" key={category} className={`category-chip ${clothingCategory === category ? "active" : ""}`} onClick={() => setClothingCategory(category)}>{category}</button>
                      ))}
                    </div>
                  </div>

                  <div className="clothing-grid">
                    {filteredClothing.map((item) => {
                      const selected = form.items.find((entry) => entry.clothingId === item.id);
                      const quantity = selected?.quantity || 0;
                      return (
                        <div className="quantity-row" key={item.id} style={{ borderColor: quantity ? "#9bc9eb" : "#e5edf4", background: quantity ? "#f7fbff" : "#fff" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                            <div style={{ width: 45, height: 45, borderRadius: 11, overflow: "hidden", background: "#edf6ff", display: "grid", placeItems: "center", color: "#70a9d7", flexShrink: 0 }}>
                              {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Shirt size={22} />}
                            </div>
                            <div style={{ minWidth: 0 }}>
                              <strong style={{ fontSize: 13, display: "block" }}>{item.name}</strong>
                              <div className="muted">ซัก {money(item.price)} · รีด {money(item.ironingPrice ?? 0)} บาท/ชิ้น</div>
                              {quantity > 0 && <div style={{ color: "#2181c2", fontSize: 11, marginTop: 3 }}>รวม {money(item.price * quantity)} บาท</div>}
                            </div>
                          </div>
                          <div className="quantity-controls">
                            <button type="button" aria-label={`ลดจำนวน${item.name}`} disabled={quantity === 0} onClick={() => changeQuantity(item, -1)}><Minus size={14} /></button>
                            <input className="quantity-input" aria-label={`จำนวน${item.name}`} type="number" min="0" step="1" value={quantityDrafts[item.id] ?? quantity} onFocus={() => setQuantityDrafts((previous) => ({ ...previous, [item.id]: String(quantity) }))} onChange={(e) => setQuantityDrafts((previous) => ({ ...previous, [item.id]: e.target.value }))} onBlur={() => {
                              const raw = quantityDrafts[item.id];
                              if (raw !== undefined) {
                                const next = Math.max(0, Math.floor(Number(raw) || 0));
                                changeQuantity(item, next - quantity);
                                setQuantityDrafts((previous) => {
                                  const updated = { ...previous };
                                  delete updated[item.id];
                                  return updated;
                                });
                              }
                            }} />
                            <button type="button" aria-label={`เพิ่มจำนวน${item.name}`} onClick={() => changeQuantity(item, 1)}><Plus size={14} /></button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {filteredClothing.length === 0 && <div className="clothing-empty">ไม่พบประเภทผ้าที่ค้นหา ลองเปลี่ยนคำค้นหาหรือหมวดหมู่</div>}

                  <div className="clothing-summary">
                    <div><strong style={{ color: "#245f89", fontSize: 15 }}>รวมทั้งหมด {totalItems} ชิ้น</strong><div style={{ fontSize: 11, color: "#7891a6", marginTop: 3 }}>เลือกผ้าแล้วสามารถกลับมาแก้จำนวนได้</div></div>
                    <strong style={{ color: "#176fae", fontSize: 17 }}>{money(selectedClothingTotal)} บาท</strong>
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>4. เลือกบริการที่ต้องการ</h2>
                  <div className="grid-3">
                    {services.map((service) => {
                      const Icon = service.icon;
                      return (
                        <label className={`check-row service-option ${form.services.includes(service.id) ? "selected" : ""}`} key={service.id}>
                          <input type="checkbox" checked={form.services.includes(service.id)} onChange={() => toggleService(service.id)} />
                          <Icon size={20} color="#2788d3" />
                          <span>{service.name}<small style={{ display: "block", color: "#8a9aac" }}>{service.id === "รีด" ? "คิดราคาตามประเภทผ้า" : service.price ? `+${service.price} บาท/ชิ้น` : "บริการหลัก"}</small></span>
                        </label>
                      );
                    })}
                  </div>
                  <div className="field" style={{ marginTop: 17, marginBottom: 0 }}>
                    <label>หมายเหตุหรือคำแนะนำเพิ่มเติม</label>
                    <textarea value={form.note} onChange={(e) => updateForm("note", e.target.value)} placeholder="เช่น แยกผ้าสีและผ้าขาว ไม่ใช้น้ำยาปรับผ้านุ่ม หรือคำแนะนำอื่น ๆ" />
                  </div>
                </div>

                <div className="card" style={{ marginBottom: 17 }}>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>5. วิธีชำระเงิน</h2>
                  <div className="choice-grid">
                    <button type="button" className={`choice ${form.paymentMethod === "โอนเงินก่อนส่งคืน" ? "selected" : ""}`} onClick={() => updateForm("paymentMethod", "โอนเงินก่อนส่งคืน")}>
                      <CreditCard size={24} color="#2788d3" />
                      <div><h3>โอนเงินก่อนส่งคืน</h3><p>ตัวอย่างพื้นที่แสดง QR และแนบสลิป</p></div>
                    </button>
                    <button type="button" className={`choice ${form.paymentMethod === "ชำระตอนรับผ้าคืน" ? "selected" : ""}`} onClick={() => updateForm("paymentMethod", "ชำระตอนรับผ้าคืน")}>
                      <Banknote size={24} color="#2788d3" />
                      <div><h3>ชำระตอนรับผ้าคืน</h3><p>ชำระเมื่อมารับผ้าหรือเมื่อร้านนำไปส่งคืน</p></div>
                    </button>
                  </div>
                  {form.paymentMethod === "โอนเงินก่อนส่งคืน" && (
                    <div className="section-note" style={{ marginTop: 14, textAlign: "center" }}>
                      <strong>ตัวอย่างพื้นที่แสดง QR Code สำหรับชำระเงิน</strong>
                      <div style={{ width: 120, height: 120, margin: "13px auto", background: "white", border: "1px dashed #9bbbd6", display: "grid", placeItems: "center", color: "#91a8bd", borderRadius: 10 }}>
                        <div><CreditCard size={30} /><br />QR ตัวอย่าง</div>
                      </div>
                      QR นี้เป็นเพียงตัวอย่าง DEMO ไม่ใช่ QR สำหรับรับเงินจริง
                    </div>
                  )}
                </div>

                <div className="card">
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "0 0 15px" }}>6. ตรวจสอบข้อมูลก่อนยืนยัน</h2>
                  <div className="booking-review">
                    <h3>ข้อมูลการจองของคุณ</h3>
                    <div className="booking-review-grid">
                      <div className="booking-review-item">ชื่อผู้ใช้บริการ<strong>{form.name || "ยังไม่ได้กรอกชื่อ"}</strong></div>
                      <div className="booking-review-item">เบอร์โทรศัพท์<strong>{form.phone || "ยังไม่ได้กรอกเบอร์โทร"}</strong></div>
                      <div className="booking-review-item">รูปแบบบริการ<strong>{form.method === "pickup" ? "ร้านไปรับและส่งคืน" : "นำผ้ามาส่งที่ร้าน"}</strong></div>
                      <div className="booking-review-item">จำนวนผ้าทั้งหมด<strong>{totalItems} ชิ้น</strong></div>
                      {form.method === "pickup" && <div className="booking-review-item" style={{ gridColumn: "1 / -1" }}>ที่อยู่รับผ้า<strong>{form.address || "ยังไม่ได้กรอกที่อยู่"}</strong></div>}
                      {form.method === "pickup" && <div className="booking-review-item">วันและเวลารับผ้า<strong>{form.pickupDate || "-"} {form.pickupTime || ""}</strong></div>}
                      <div className="booking-review-item">บริการที่เลือก<strong>{form.services.length ? form.services.map((id) => services.find((service) => service.id === id)?.name).filter(Boolean).join(" · ") : "ยังไม่ได้เลือกบริการ"}</strong></div>
                      <div className="booking-review-item">วิธีชำระเงิน<strong>{form.paymentMethod}</strong></div>
                    </div>
                    <div style={{ marginTop: 12, paddingTop: 11, borderTop: "1px solid var(--theme-border)" }}>
                      <div className="booking-review-item">รายการผ้า<strong>{form.items.length ? form.items.map((item) => `${item.name} × ${item.quantity}`).join(" · ") : "ยังไม่ได้เลือกประเภทผ้า"}</strong></div>
                    </div>
                  </div>
                  <h2 style={{ fontSize: 18, color: "#315675", margin: "18px 0 15px" }}>สรุปราคา</h2>
                  {form.items.map((item) => (
                    <div className="summary-line" key={item.clothingId}>
                      <span>{item.name} × {item.quantity}</span>
                      <strong>{money(form.services.includes("ซัก") ? item.price * item.quantity : 0)} บาท</strong>
                    </div>
                  ))}
                  {form.services.includes("อบ") && <div className="summary-line"><span>บริการอบผ้า</span><strong>{money(totalItems * 5)} บาท</strong></div>}
                  {form.services.includes("รีด") && <div className="summary-line"><span>บริการรีดผ้า (คิดตามประเภทผ้า)</span><strong>{money(bookingBreakdown.ironing)} บาท</strong></div>}
                  <div className="summary-total">
                    <div className="summary-line" style={{ color: "inherit", fontSize: 17 }}>
                      <span>ยอดรวมตัวอย่าง</span><strong>{money(bookingTotal)} บาท</strong>
                    </div>
                  </div>
                  <p className="muted">* ราคาซักและราคารีดกำหนดแยกตามประเภทผ้า ส่วนอบคิดเพิ่ม 5 บาท/ชิ้น · ราคาเป็นตัวอย่างสำหรับเว็บไซต์ DEMO</p>
                  <button className="button primary" type="submit" style={{ width: "100%", marginTop: 9 }}>
                    <Check size={17} /> ยืนยันการจองคิว
                  </button>
                </div>
              </form>
            )}
          </>
        )}

        {page === "guide" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">USER GUIDE</div>
                <h1 className="page-title">คู่มือการใช้งานเว็บไซต์</h1>
                <p className="muted">คำแนะนำการใช้งานระบบ DEMO Laundry ทีละขั้นตอน</p>
              </div>
            </div>

            <div className="guide-intro">
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="feature-icon" style={{ margin: 0, background: "white" }}>
                  <BookOpen size={25} />
                </div>
                <div>
                  <h2>ยินดีต้อนรับสู่คู่มือการใช้งาน</h2>
                  <p className="muted" style={{ margin: 0 }}>
                    เลือกหมวดคู่มือที่ต้องการอ่าน เพื่อเรียนรู้วิธีใช้งานเว็บไซต์
                  </p>
                </div>
              </div>
            </div>

            <div className="guide-tabs">
              <button className={guideTab === "customer" ? "active" : ""} onClick={() => setGuideTab("customer")}>
                <User size={17} /> คู่มือสำหรับลูกค้า
              </button>
              {userRole === "admin" && (
                <button className={guideTab === "admin" ? "active" : ""} onClick={() => setGuideTab("admin")}>
                  <Settings size={17} /> คู่มือสำหรับเจ้าของร้าน
                </button>
              )}
            </div>

            <div className="section-note" style={{ marginBottom: 17 }}>
              {guideTab === "customer"
                ? "ส่วนนี้อธิบายวิธีใช้บริการสำหรับลูกค้า ตั้งแต่ตรวจสอบร้านจนถึงยืนยันการจอง"
                : "ส่วนนี้อธิบายวิธีจัดการเว็บไซต์สำหรับเจ้าของร้าน ตั้งแต่ตั้งค่าสถานะร้านจนถึงดูประวัติลูกค้า"}
            </div>

            {(guideTab === "customer" ? guideCustomer : guideAdmin).map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div className="card guide-card" key={guide.title}>
                  <div className="guide-icon"><Icon size={24} /></div>
                  <div>
                    <h3>{index + 1}. {guide.title}</h3>
                    <p>{guide.description}</p>
                    <ol className="guide-steps">
                      {guide.steps.map((step, stepIndex) => (
                        <li key={stepIndex}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              );
            })}

            <div className="section-note" style={{ marginTop: 20 }}>
              <strong>หมายเหตุ:</strong> คู่มือนี้เป็นส่วนหนึ่งของเว็บไซต์ สามารถกลับมาเปิดอ่านได้ทุกเวลา โดยเลือกเมนู “คู่มือการใช้งาน” บนแถบเมนูด้านบน
            </div>
            <button className="button primary" style={{ marginTop: 20 }} onClick={() => goTo("home")}>
              <Home size={16} /> กลับหน้าแรก
            </button>
          </>
        )}

        {page === "admin" && (
          <>
            <div className="section-head">
              <div>
                <div className="eyebrow">ADMINISTRATION</div>
                <h1 className="page-title">ระบบจัดการร้าน</h1>
                <p className="muted">จัดการคิวงาน ลูกค้า ประเภทผ้า ผลิตภัณฑ์ และสถานะร้าน</p>
              </div>
            </div>

            <div className="admin-layout">
              <aside className="card admin-menu">
                {[
                  ["overview", Home, "ภาพรวมร้าน"],
                  ["bookings", ClipboardList, "จัดการรายการจอง"],
                  ["customers", Users, "ประวัติลูกค้า"],
                  ["clothing", Shirt, "จัดการประเภทผ้า"],
                  ["products", Package, "ผลิตภัณฑ์ซักรีด"],
                  ["stock", Droplets, "สต็อกน้ำยา"],
                  ["reports", ChartNoAxesCombined, "รายงานรายได้"],
                  ["calculator", Calculator, "เครื่องคิดเลข"],
                  ["shop", Store, "สถานะร้าน"],
                  ["appearance", Settings, "ปรับแต่งธีมเว็บไซต์"],
                ].map(([id, Icon, label]) => (
                  <button key={id} className={adminTab === id ? "active" : ""} onClick={() => {
                    setAdminTab(id);
                    setSelectedBookingId(null);
                    if (id !== "customers") setSelectedCustomer(null);
                  }}>
                    <Icon size={17} /> {label}
                  </button>
                ))}
              </aside>

              <section className="card admin-content">
                {adminTab === "overview" && (
                  <>
                    <div className="section-head" style={{ marginBottom: 12 }}>
                      <div>
                        <h2 style={{ marginBottom: 4 }}>ภาพรวมร้านซักอบรีด</h2>
                        <p className="muted" style={{ margin: 0 }}>สรุปภาพรวมคิวงานและรายรับจากข้อมูลตัวอย่างในระบบ</p>
                      </div>
                      <span className={`status-pill ${shopOpen ? "green" : "red"}`}>{shopOpen ? "ร้านเปิด" : "ร้านปิด"}</span>
                    </div>
                    <div className="dashboard-grid">
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>คิวทั้งหมด</span><span className="dashboard-stat-icon"><ClipboardList size={19}/></span></div><strong>{bookings.length}</strong><small>รายการจองในระบบ</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>งานที่ยังไม่เสร็จ</span><span className="dashboard-stat-icon"><Clock size={19}/></span></div><strong>{bookings.filter((b) => !["เสร็จสิ้น", "ยกเลิก"].includes(b.status)).length}</strong><small>รอดำเนินการหรือกำลังให้บริการ</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>งานเสร็จสิ้น</span><span className="dashboard-stat-icon"><Check size={19}/></span></div><strong>{bookings.filter((b) => b.status === "เสร็จสิ้น").length}</strong><small>รายการที่ปิดงานแล้ว</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>ยอดชำระแล้ว</span><span className="dashboard-stat-icon"><Banknote size={19}/></span></div><strong>{money(bookings.filter((b) => b.paymentStatus === "ชำระเงินแล้ว").reduce((sum, b) => sum + Number(b.total || 0), 0))}</strong><small>บาท · เฉพาะรายการที่ชำระแล้ว</small></div>
                    </div>
                    <div className="dashboard-columns">
                      <div className="card" style={{ padding: 16 }}>
                        <div className="section-head" style={{ marginBottom: 12 }}><div><h3 style={{ margin: 0 }}>คิวล่าสุด</h3><p className="muted" style={{ margin: "4px 0 0" }}>เลขคิวและสถานะงานที่เพิ่งเข้ามา</p></div><button className="button secondary small-button" onClick={() => setAdminTab("bookings")}>ดูคิวทั้งหมด <ChevronRight size={14}/></button></div>
                        <div className="dashboard-list">
                          {[...bookings].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5).map((booking) => (
                            <div className="dashboard-order" key={booking.id}>
                              <div><div className="dashboard-queue">{booking.id}</div><strong style={{ display: "block", color: "var(--theme-heading)", marginTop: 3 }}>{booking.name}</strong><small className="muted">{booking.method === "pickup" ? "ร้านไปรับ–ส่ง" : "นำมาส่งที่ร้าน"} · {money(booking.total)} บาท</small></div>
                              <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}><span className={`status-pill ${statusColor(booking.status)}`}>{booking.status}</span><button className="button outline small-button" onClick={() => { setSelectedBookingId(booking.id); setAdminTab("bookings"); }}>เปิด</button></div>
                            </div>
                          ))}
                          {bookings.length === 0 && <div className="empty"><ClipboardList size={28}/><p>ยังไม่มีรายการจอง</p></div>}
                        </div>
                      </div>
                      <div className="card" style={{ padding: 16 }}>
                        <h3 style={{ margin: "0 0 6px" }}>สถานะงานในร้าน</h3>
                        <p className="muted" style={{ margin: "0 0 10px" }}>จำนวนรายการแยกตามขั้นตอนปัจจุบัน</p>
                        {["รอตรวจรับผ้า", "รอเข้ารับผ้า", "รับผ้าแล้ว", "กำลังดำเนินการ", "กำลังซัก", "กำลังอบ", "กำลังรีด", "พร้อมส่งคืน", "กำลังจัดส่ง", "ส่งคืนแล้ว", "เสร็จสิ้น", "ยกเลิก"].map((status) => {
                          const count = bookings.filter((b) => b.status === status).length;
                          return count > 0 ? <div className="dashboard-status-row" key={status}><span>{status}</span><strong style={{ color: "var(--theme-primary)" }}>{count} รายการ</strong></div> : null;
                        })}
                        <button className="button primary" style={{ width: "100%", marginTop: 14 }} onClick={() => setAdminTab("bookings")}><ClipboardList size={15}/> ไปจัดการรายการจอง</button>
                      </div>
                    </div>
                    <div className="section-note" style={{ marginTop: 15 }}>ข้อมูลบน Dashboard คำนวณจากรายการจองที่อยู่ใน DEMO นี้เท่านั้น ยังไม่ใช่รายงานจากฐานข้อมูลจริง</div>
                  </>
                )}

                {adminTab === "bookings" && (
                  <>
                    <h2>จัดการรายการจองและงานซักรีด</h2>
                    {!selectedBooking ? (
                      <>
                        <div className="detail-grid" style={{ marginBottom: 18 }}>
                          <div className="stat"><small>รายการจองทั้งหมด</small><strong>{bookings.length}</strong></div>
                          <div className="stat"><small>รอดำเนินการ</small><strong>{bookings.filter((b) => b.status !== "เสร็จสิ้น").length}</strong></div>
                          <div className="stat"><small>เสร็จสิ้น</small><strong>{bookings.filter((b) => b.status === "เสร็จสิ้น").length}</strong></div>
                        </div>
                        {bookings.length === 0 ? (
                          <div className="empty"><ClipboardList size={35} /><p>ยังไม่มีรายการจอง</p></div>
                        ) : (
                          <div className="table-wrap">
                            <table>
                              <thead>
                                <tr><th>เลขที่จอง</th><th>ลูกค้า</th><th>รูปแบบบริการ</th><th>ยอดรวม</th><th>สถานะงาน</th><th>รายละเอียด</th></tr>
                              </thead>
                              <tbody>
                                {bookings.map((booking) => (
                                  <tr key={booking.id}>
                                    <td><span className="queue-highlight">{booking.id}</span></td>
                                    <td>{booking.name}<br /><small>{booking.phone}</small></td>
                                    <td>{booking.method === "pickup" ? "ร้านไปรับ–ส่ง" : "นำมาส่งที่ร้าน"}</td>
                                    <td>{money(booking.total)} บาท</td>
                                    <td><span className={`status-pill ${statusColor(booking.status)}`}>{booking.status}</span></td>
                                    <td><button className="button secondary small-button" onClick={() => setSelectedBookingId(booking.id)}><Eye size={13} /> ดูรายละเอียด</button></td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </>
                    ) : (
                      <>
                        <button className="button outline small-button" onClick={() => setSelectedBookingId(null)} style={{ marginBottom: 15 }}>
                          <ArrowLeft size={14} /> กลับรายการจอง
                        </button>
                        <h3>รายละเอียดรายการ {selectedBooking.id}</h3>
                        <div className="detail-grid" style={{ margin: "14px 0" }}>
                          <div className="stat"><small>ชื่อลูกค้า</small><strong style={{ fontSize: 15 }}>{selectedBooking.name}</strong></div>
                          <div className="stat"><small>เบอร์โทรศัพท์</small><strong style={{ fontSize: 15 }}>{selectedBooking.phone}</strong></div>
                          <div className="stat"><small>ยอดรวม</small><strong>{money(selectedBooking.total)} บาท</strong></div>
                        </div>
                        <div className="section-note">
                          <strong>รูปแบบบริการ:</strong> {selectedBooking.method === "pickup" ? "ร้านไปรับและส่งคืน" : "ลูกค้านำผ้ามาส่งที่ร้าน"}
                          {selectedBooking.method === "pickup" && <>
                            <br /><strong>ที่อยู่:</strong> {selectedBooking.address}
                            <br /><strong>วันเข้ารับ:</strong> {selectedBooking.pickupDate} เวลา {selectedBooking.pickupTime}
                          </>}
                          <br /><strong>วันที่จอง:</strong> {dateText(selectedBooking.createdAt)}
                          <br /><strong>หมายเหตุ:</strong> {selectedBooking.note || "-"}
                        </div>

                        <div className="no-print" style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" }}>
                          <button className="button primary" onClick={printReceipt}><Printer size={15} /> พิมพ์ใบรับผ้า / ใบเสร็จ</button>
                        </div>
                        <div className="print-receipt">
                          <div style={{ textAlign: "center", marginBottom: 18 }}>
                            <h2 style={{ margin: 0 }}>DEMO Laundry</h2>
                            <p style={{ margin: "4px 0", color: "#64748b" }}>ใบรับผ้า / ใบเสร็จรับเงิน</p>
                            <strong>{selectedBooking.id}</strong>
                          </div>
                          <div className="receipt-meta"><span>ลูกค้า: {selectedBooking.name}</span><span>โทร: {selectedBooking.phone}</span><span>วันที่: {dateText(selectedBooking.createdAt)}</span><span>รูปแบบรับผ้า: {selectedBooking.method === "pickup" ? "ร้านไปรับ–ส่ง" : "ลูกค้านำมาส่ง"}</span></div>
                          <table className="receipt-table"><thead><tr><th>รายการ</th><th>จำนวน</th><th>ราคา/หน่วย</th><th>รวม</th></tr></thead><tbody>
                            {(selectedBooking.services || []).includes("ซัก") && selectedBooking.items.map((item, index) => <tr key={index}><td>{item.name} · ซัก</td><td>{item.quantity}</td><td>{money(item.price)}</td><td>{money(item.price * item.quantity)}</td></tr>)}
                            {(selectedBooking.services || []).includes("อบ") && <tr><td>บริการอบผ้า</td><td>{selectedBooking.items.reduce((n, item) => n + item.quantity, 0)}</td><td>5</td><td>{money(selectedBooking.breakdown?.drying ?? selectedBooking.items.reduce((n, item) => n + item.quantity, 0) * 5)}</td></tr>}
                            {(selectedBooking.services || []).includes("รีด") && selectedBooking.items.map((item, index) => <tr key={`iron-${index}`}><td>{item.name} · รีด</td><td>{item.quantity}</td><td>{money(item.ironingPrice ?? 5)}</td><td>{money(Number(item.ironingPrice ?? 5) * item.quantity)}</td></tr>)}
                          </tbody></table>
                          <div className="receipt-total"><span>ยอดรวมสุทธิ</span><strong>{money(selectedBooking.total)} บาท</strong></div>
                          <div className="receipt-meta"><span>วิธีชำระ: {selectedBooking.paymentMethod}</span><span>สถานะ: {selectedBooking.paymentStatus}</span></div>
                          <p style={{ textAlign: "center", marginTop: 24, fontSize: 11, color: "#64748b" }}>ขอบคุณที่ใช้บริการ DEMO Laundry</p>
                        </div>
                        <div className="handover-preview">
                          <div className="handover-preview-title"><strong><ClipboardList size={16} style={{ verticalAlign: "middle" }}/> ใบตรวจสอบก่อนเริ่มงาน</strong><span className="queue-highlight">{selectedBooking.id}</span></div>
                          <p><strong>ลูกค้า:</strong> {selectedBooking.name} · {selectedBooking.phone}</p>
                          <p><strong>วิธีรับผ้า:</strong> {selectedBooking.method === "pickup" ? "ร้านไปรับและส่งคืน" : "ลูกค้านำมาส่งที่ร้าน"}</p>
                          {selectedBooking.method === "pickup" && <p><strong>ที่อยู่รับผ้า:</strong> {selectedBooking.address || "ยังไม่ได้ระบุ"} · {selectedBooking.pickupDate || "ไม่ระบุวัน"} {selectedBooking.pickupTime || ""}</p>}
                          <p><strong>รายการ:</strong> {selectedBooking.items.map((item) => `${item.name} × ${item.quantity}`).join(", ") || "ไม่มีรายการ"}</p>
                          <p><strong>บริการ:</strong> {(selectedBooking.services || []).join(", ") || "ไม่ระบุ"}</p>
                          <p><strong>หมายเหตุ:</strong> {selectedBooking.note || "ไม่มี"}</p>
                          <p style={{ marginTop: 9, fontWeight: 700 }}>ตรวจสอบจำนวนผ้าและตำหนิก่อนเริ่มดำเนินการทุกครั้ง</p>
                        </div>
                        <h3 style={{ marginTop: 20 }}>รายการผ้าและบริการ</h3>
                        {selectedBooking.items.map((item, index) => (
                          <div className="summary-line" key={index}>
                            <span>{item.name} × {item.quantity}</span><strong>{money(item.price * item.quantity)} บาท</strong>
                          </div>
                        ))}
                        <div className="summary-line"><span>บริการที่เลือก</span><strong>{selectedBooking.services.join(", ")}</strong></div>

                        <div className="form-grid" style={{ marginTop: 20 }}>
                          <div className="field">
                            <label>สถานะการดำเนินงาน</label>
                            <select value={selectedBooking.status} onChange={(e) => updateBooking(selectedBooking.id, { status: e.target.value })}>
                              {["รอตรวจรับผ้า", "รอเข้ารับผ้า", "รับผ้าแล้ว", "กำลังดำเนินการ", "กำลังซัก", "กำลังอบ", "กำลังรีด", "พร้อมส่งคืน", "กำลังจัดส่ง", "ส่งคืนแล้ว", "เสร็จสิ้น", "ยกเลิก"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                          <div className="field">
                            <label>สถานะการชำระเงิน</label>
                            <select value={selectedBooking.paymentStatus} onChange={(e) => updateBooking(selectedBooking.id, { paymentStatus: e.target.value })}>
                              {["รอชำระเงิน", "รอตรวจสอบสลิป", "ชำระเงินแล้ว"].map((status) => <option key={status}>{status}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="field">
                          <label>ผลิตภัณฑ์ที่ใช้กับงานนี้</label>
                          <div className="grid-2">
                            {products.map((product) => (
                              <label className="check-row" key={product.id}>
                                <input
                                  type="checkbox"
                                  checked={(selectedBooking.detergents || []).includes(product.name)}
                                  onChange={(e) => {
                                    const current = selectedBooking.detergents || [];
                                    const next = e.target.checked
                                      ? [...current, product.name]
                                      : current.filter((name) => name !== product.name);
                                    updateBooking(selectedBooking.id, { detergents: next });
                                  }}
                                />
                                {product.name}
                              </label>
                            ))}
                          </div>
                        </div>

                        <hr className="divider" />
                        <h3>ภาพถ่ายประกอบการให้บริการ</h3>
                        <div className="section-note">
                          ถ่ายภาพตำหนิเฉพาะผ้าที่มีตำหนิอยู่ก่อนรับผ้า เช่น รอยขาดหรือรอยเปื้อน ไม่จำเป็นต้องถ่ายทุกชิ้น และถ่ายภาพหลักฐานตอนส่งคืนผ้า
                        </div>
                        <div className="form-grid" style={{ marginTop: 14 }}>
                          <div className="field">
                            <label><Camera size={14} style={{ verticalAlign: "middle" }} /> ภาพตำหนิก่อนซัก (ถ้ามี)</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => updateBooking(selectedBooking.id, { defectImage: image }))} />
                            {selectedBooking.defectImage && <img className="image-preview" src={selectedBooking.defectImage} alt="ภาพตำหนิก่อนซัก" />}
                          </div>
                          <div className="field">
                            <label><Camera size={14} style={{ verticalAlign: "middle" }} /> ภาพหลักฐานตอนส่งคืน</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => updateBooking(selectedBooking.id, { returnImage: image }))} />
                            {selectedBooking.returnImage && <img className="image-preview" src={selectedBooking.returnImage} alt="ภาพหลักฐานตอนส่งคืน" />}
                          </div>
                        </div>
                        <div className="field">
                          <label>วันที่และเวลาส่งคืน</label>
                          <input type="datetime-local" value={selectedBooking.returnDate || ""} onChange={(e) => updateBooking(selectedBooking.id, { returnDate: e.target.value })} />
                        </div>
                        <div className="section-note">
                          วิธีชำระเงิน: {selectedBooking.paymentMethod}
                          <br />สถานะปัจจุบัน: {selectedBooking.paymentStatus}
                          <br />การตรวจสอบสลิปเป็นการตรวจสอบโดยเจ้าของร้านใน DEMO นี้
                        </div>
                      </>
                    )}
                  </>
                )}

                {adminTab === "customers" && (
                  <>
                    <h2>ประวัติลูกค้า</h2>
                    {!activeCustomer ? (
                      <>
                        <div className="field">
                          <label>ค้นหาด้วยชื่อลูกค้าหรือเบอร์โทรศัพท์</label>
                          <div style={{ position: "relative" }}>
                            <Search size={17} style={{ position: "absolute", left: 13, top: 13, color: "#91a3b5" }} />
                            <input className="search-input" style={{ paddingLeft: 40 }} value={customerSearch} onChange={(e) => setCustomerSearch(e.target.value)} placeholder="ค้นหาชื่อหรือเบอร์โทรศัพท์" />
                          </div>
                        </div>
                        <div className="section-note" style={{ marginBottom: 14 }}>
                          ระบบรวมประวัติจากเบอร์โทรศัพท์เดียวกัน เมื่อลูกค้าจองครั้งใหม่ด้วยเบอร์เดิม รายการจะถูกรวมไว้ในประวัติของลูกค้าคนนั้น
                        </div>
                        {filteredCustomers.length === 0 ? (
                          <div className="empty"><Users size={35} /><p>ไม่พบข้อมูลลูกค้า</p></div>
                        ) : filteredCustomers.map((customer) => (
                          <div className="customer-row" key={customer.key}>
                            <div style={{ display: "flex", gap: 11, alignItems: "center" }}>
                              <div className="customer-avatar"><User size={21} /></div>
                              <div>
                                <strong>{customer.name}</strong>
                                <div className="muted">{customer.phone || "ไม่มีเบอร์โทรศัพท์"}</div>
                                <div className="muted">ใช้บริการ {customer.count} ครั้ง</div>
                                <div className="customer-queue-heading">เลขคิวที่เคยใช้บริการ</div>
                                <div className="customer-queue-list" aria-label="เลขคิวของลูกค้า">
                                  {customer.bookings.map((booking) => (
                                    <span className="queue-chip" key={booking.id}><span className="queue-dot" />{booking.id}</span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <button className="button secondary small-button" onClick={() => setSelectedCustomer(customer.key)}>ดูประวัติ <ChevronRight size={13} /></button>
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <button className="button outline small-button" onClick={() => setSelectedCustomer(null)} style={{ marginBottom: 15 }}><ArrowLeft size={14} /> กลับรายชื่อลูกค้า</button>
                        <h3>{activeCustomer.name}</h3>
                        <p className="muted"><Phone size={13} style={{ verticalAlign: "middle" }} /> {activeCustomer.phone || "ไม่มีเบอร์โทรศัพท์"}</p>
                        <div className="detail-grid" style={{ margin: "17px 0" }}>
                          <div className="stat"><small>จำนวนครั้งที่ใช้บริการ</small><strong>{activeCustomer.count}</strong></div>
                          <div className="stat"><small>ยอดชำระสะสม</small><strong>{money(activeCustomer.paid)} บาท</strong></div>
                          <div className="stat"><small>ยอดใช้บริการรวม</small><strong>{money(activeCustomer.total)} บาท</strong></div>
                        </div>
                        <h3>ประวัติการใช้บริการทั้งหมด</h3>
                        {activeCustomer.bookings.map((booking) => (
                          <div className="card" key={booking.id} style={{ marginTop: 12, background: "#fbfdff" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                              <strong>{booking.id}</strong>
                              <span className={`status-pill ${statusColor(booking.status)}`}>{booking.status}</span>
                            </div>
                            <p className="muted">{dateText(booking.createdAt)}</p>
                            <p className="muted">รูปแบบบริการ: {booking.method === "pickup" ? "ร้านไปรับและส่งคืน" : "ลูกค้านำมาส่งที่ร้าน"}</p>
                            <div className="summary-line"><span>รายการผ้า</span><strong>{booking.items.map((item) => `${item.name} × ${item.quantity}`).join(", ")}</strong></div>
                            <div className="summary-line"><span>บริการ</span><strong>{booking.services.join(", ")}</strong></div>
                            <div className="summary-line"><span>ยอดรวม</span><strong>{money(booking.total)} บาท</strong></div>
                            <div className="summary-line"><span>การชำระเงิน</span><strong>{booking.paymentStatus}</strong></div>
                            {booking.note && <p className="muted">หมายเหตุ: {booking.note}</p>}
                            <button className="button secondary small-button" onClick={() => {
                              setSelectedBookingId(booking.id);
                              setAdminTab("bookings");
                            }}>ดูรายละเอียดงาน</button>
                          </div>
                        ))}
                      </>
                    )}
                  </>
                )}

                {adminTab === "clothing" && (
                  <>
                    <h2>จัดการประเภทผ้า</h2>
                    <div className="section-note" style={{ marginBottom: 16 }}>
                      เพิ่มประเภทผ้า กำหนดราคา และอัปโหลดรูปภาพจริงเพื่อให้ลูกค้าเห็นในหน้ารายการผ้า
                    </div>
                    <form onSubmit={addClothing}>
                      <div className="form-grid">
                        <div className="field">
                          <label>ชื่อประเภทผ้า</label>
                          <input value={newClothing.name} onChange={(e) => setNewClothing({ ...newClothing, name: e.target.value })} placeholder="เช่น เสื้อโปโล" />
                        </div>
                        <div className="field">
                          <label>ราคาเริ่มต้น (บาท)</label>
                          <input type="number" min="0" value={newClothing.price} onChange={(e) => setNewClothing({ ...newClothing, price: e.target.value })} placeholder="0" />
                        </div>
                        <div className="field">
                          <label>ราคารีด (บาท/ชิ้น)</label>
                          <input type="number" min="0" value={newClothing.ironingPrice} onChange={(e) => setNewClothing({ ...newClothing, ironingPrice: e.target.value })} placeholder="0 หากไม่รับรีด" />
                        </div>
                        <div className="field">
                          <label>หมวดหมู่</label>
                          <select value={newClothing.category} onChange={(e) => setNewClothing({ ...newClothing, category: e.target.value })}>
                            <option>เสื้อผ้า</option><option>เครื่องนอน</option><option>ผ้าอื่น ๆ</option>
                          </select>
                        </div>
                        <div className="field">
                          <label>รูปภาพประเภทผ้า</label>
                          <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setNewClothing((prev) => ({ ...prev, image })))} />
                        </div>
                      </div>
                      {newClothing.image && <img className="image-preview" src={newClothing.image} alt="ตัวอย่างรูปประเภทผ้า" />}
                      <button className="button primary" type="submit" style={{ marginTop: 10 }}><Plus size={16} /> เพิ่มประเภทผ้า</button>
                    </form>

                    <hr className="divider" />
                    <h3>รายการประเภทผ้าที่มีในร้าน</h3>
                    {clothing.map((item) => (
                      <div className="customer-row" key={item.id}>
                        <div style={{ display: "flex", gap: 11, alignItems: "center", minWidth: 0 }}>
                          <div style={{ width: 55, height: 55, borderRadius: 10, background: "#edf6ff", overflow: "hidden", display: "grid", placeItems: "center", color: "#70a9d7", flexShrink: 0 }}>
                            {item.image ? <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Shirt size={25} />}
                          </div>
                          <div><strong>{item.name}</strong><div className="muted">ซัก {money(item.price)} บาท · รีด {money(item.ironingPrice ?? 0)} บาท</div></div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="button secondary small-button" onClick={() => setEditingClothing({ ...item })}><Edit size={13} /> แก้ไข</button>
                          <button className="button danger small-button" onClick={() => deleteClothing(item.id)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}

                    {editingClothing && (
                      <div className="card" style={{ marginTop: 18, background: "#f8fbff" }}>
                        <h3>แก้ไขประเภทผ้า</h3>
                        <div className="form-grid">
                          <div className="field">
                            <label>ชื่อประเภทผ้า</label>
                            <input value={editingClothing.name} onChange={(e) => setEditingClothing({ ...editingClothing, name: e.target.value })} />
                          </div>
                          <div className="field">
                            <label>ราคา</label>
                            <input type="number" min="0" value={editingClothing.price} onChange={(e) => setEditingClothing({ ...editingClothing, price: e.target.value })} />
                          </div>
                          <div className="field">
                            <label>ราคารีด (บาท/ชิ้น)</label>
                            <input type="number" min="0" value={editingClothing.ironingPrice ?? 0} onChange={(e) => setEditingClothing({ ...editingClothing, ironingPrice: e.target.value })} />
                          </div>
                          <div className="field">
                            <label>หมวดหมู่</label>
                            <select value={editingClothing.category} onChange={(e) => setEditingClothing({ ...editingClothing, category: e.target.value })}>
                              <option>เสื้อผ้า</option><option>เครื่องนอน</option><option>ผ้าอื่น ๆ</option>
                            </select>
                          </div>
                          <div className="field">
                            <label>เปลี่ยนรูปภาพ</label>
                            <input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setEditingClothing((prev) => ({ ...prev, image })))} />
                          </div>
                        </div>
                        {editingClothing.image && <img className="image-preview" src={editingClothing.image} alt="รูปตัวอย่าง" />}
                        <div style={{ display: "flex", gap: 8, marginTop: 13 }}>
                          <button className="button primary" onClick={saveClothing}><Save size={15} /> บันทึก</button>
                          <button className="button outline" onClick={() => setEditingClothing(null)}>ยกเลิก</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {adminTab === "products" && (
                  <>
                    <h2>จัดการผลิตภัณฑ์ซักรีด</h2>
                    <div className="section-note" style={{ marginBottom: 16 }}>
                      บันทึกผลิตภัณฑ์ที่ร้านใช้ เช่น น้ำยาซักผ้า น้ำยาปรับผ้านุ่ม และผลิตภัณฑ์ขจัดคราบ
                    </div>
                    <form onSubmit={addProduct}>
                      <div className="form-grid">
                        <div className="field"><label>ชื่อผลิตภัณฑ์</label><input value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} placeholder="ชื่อผลิตภัณฑ์" /></div>
                        <div className="field"><label>ยี่ห้อ</label><input value={newProduct.brand} onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })} placeholder="ยี่ห้อ" /></div>
                        <div className="field">
                          <label>ประเภทผลิตภัณฑ์</label>
                          <select value={newProduct.type} onChange={(e) => setNewProduct({ ...newProduct, type: e.target.value })}>
                            <option>น้ำยาซักผ้า</option><option>น้ำยาปรับผ้านุ่ม</option><option>ขจัดคราบ</option><option>ผลิตภัณฑ์อื่น ๆ</option>
                          </select>
                        </div>
                        <div className="field"><label>กลิ่น / สูตร</label><input value={newProduct.scent} onChange={(e) => setNewProduct({ ...newProduct, scent: e.target.value })} /></div>
                        <div className="field"><label>ราคา (บาท)</label><input type="number" min="0" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} /></div>
                        <div className="field"><label>รายละเอียด</label><input value={newProduct.description} onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })} /></div>
                        <div className="field"><label>จำนวนคงเหลือเริ่มต้น</label><input type="number" min="0" value={newProduct.stock} onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })} placeholder="0" /></div>
                        <div className="field"><label>หน่วยนับ</label><select value={newProduct.unit} onChange={(e) => setNewProduct({ ...newProduct, unit: e.target.value })}><option>ขวด</option><option>แกลลอน</option><option>ถุง</option><option>กล่อง</option><option>ชิ้น</option><option>ลิตร</option></select></div>
                        <div className="field"><label>รูปภาพผลิตภัณฑ์</label><input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setNewProduct((prev) => ({ ...prev, image })))} /></div>
                      </div>
                      {newProduct.image && <img className="image-preview" src={newProduct.image} alt="ตัวอย่างผลิตภัณฑ์" />}

                      <button className="button primary" type="submit"><Plus size={15} /> เพิ่มผลิตภัณฑ์</button>
                    </form>
                    <hr className="divider" />
                    <h3>รายการผลิตภัณฑ์</h3>
                    {products.map((item) => (
                      <div className="customer-row" key={item.id}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div className="product-thumb">{item.image ? <img src={item.image} alt={item.name} /> : <Package size={22} />}</div>
                          <div><strong>{item.name}</strong>
                          <div className="muted">{item.brand} · {item.type} · {item.scent}</div>
                          <div className="muted">{money(item.price)} บาท · คงเหลือ {money(item.stock || 0)} {item.unit || "หน่วย"}</div>
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: 6 }}>
                          <button className="button secondary small-button" onClick={() => setEditingProduct({ ...item })}><Edit size={13} /> แก้ไข</button>
                          <button className="button danger small-button" onClick={() => deleteProduct(item.id)}><Trash2 size={13} /></button>
                        </div>
                      </div>
                    ))}
                    {editingProduct && (
                      <div className="card" style={{ marginTop: 18, background: "#f8fbff" }}>
                        <h3>แก้ไขผลิตภัณฑ์</h3>
                        <div className="form-grid">
                          <div className="field"><label>ชื่อผลิตภัณฑ์</label><input value={editingProduct.name} onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })} /></div>
                          <div className="field"><label>ยี่ห้อ</label><input value={editingProduct.brand} onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })} /></div>
                          <div className="field">
                            <label>ประเภท</label>
                            <select value={editingProduct.type} onChange={(e) => setEditingProduct({ ...editingProduct, type: e.target.value })}>
                              <option>น้ำยาซักผ้า</option><option>น้ำยาปรับผ้านุ่ม</option><option>ขจัดคราบ</option><option>ผลิตภัณฑ์อื่น ๆ</option>
                            </select>
                          </div>
                          <div className="field"><label>กลิ่น / สูตร</label><input value={editingProduct.scent} onChange={(e) => setEditingProduct({ ...editingProduct, scent: e.target.value })} /></div>
                          <div className="field"><label>ราคา</label><input type="number" min="0" value={editingProduct.price} onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })} /></div>
                          <div className="field"><label>รายละเอียด</label><input value={editingProduct.description || ""} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} /></div>
                          <div className="field"><label>จำนวนคงเหลือ</label><input type="number" min="0" value={editingProduct.stock ?? 0} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} /></div>
                          <div className="field"><label>หน่วยนับ</label><select value={editingProduct.unit || "ขวด"} onChange={(e) => setEditingProduct({ ...editingProduct, unit: e.target.value })}><option>ขวด</option><option>แกลลอน</option><option>ถุง</option><option>กล่อง</option><option>ชิ้น</option><option>ลิตร</option></select></div>
                          <div className="field"><label>เปลี่ยนรูปภาพ</label><input type="file" accept="image/*" onChange={(e) => readImage(e.target.files[0], (image) => setEditingProduct((prev) => ({ ...prev, image })))} /></div>
                        </div>
                        {editingProduct.image && <img className="image-preview" src={editingProduct.image} alt="รูปผลิตภัณฑ์" />}

                        <div style={{ display: "flex", gap: 8 }}>
                          <button className="button primary" onClick={saveProduct}><Save size={15} /> บันทึก</button>
                          <button className="button outline" onClick={() => setEditingProduct(null)}>ยกเลิก</button>
                        </div>
                      </div>
                    )}
                  </>
                )}

                {adminTab === "stock" && (
                  <>
                    <div className="section-head"><div><h2>จัดการสต็อกผลิตภัณฑ์</h2><p className="muted">บันทึกการเติมและเบิกใช้น้ำยาของร้าน</p></div><span className="tag">{products.length} ผลิตภัณฑ์</span></div>
                    <div className="stock-grid">
                      {products.map((product) => (
                        <div className="stock-card" key={product.id}>
                          <div className="stock-card-top"><div className="product-thumb">{product.image ? <img src={product.image} alt={product.name} /> : <Droplets size={22}/>}</div><div style={{ minWidth: 0 }}><strong>{product.name}</strong><small>{product.type}</small></div></div>
                          <div className="stock-amount"><strong>{money(product.stock || 0)}</strong><span>{product.unit || "หน่วย"} คงเหลือ</span></div>
                          <span className={`status-pill ${(product.stock || 0) <= 2 ? "orange" : "green"}`}>{(product.stock || 0) <= 2 ? "ควรเติมสต็อก" : "มีสินค้าเพียงพอ"}</span>
                          <div className="stock-adjust"><input aria-label={`จำนวนปรับสต็อก ${product.name}`} type="number" min="0.01" step="0.01" placeholder="จำนวน" value={stockDrafts[product.id]?.amount || ""} onChange={(e) => setStockDrafts((prev) => ({ ...prev, [product.id]: { amount: e.target.value } }))}/><button className="button secondary small-button" onClick={() => adjustStock(product.id, "in")}>เติม</button><button className="button outline small-button" onClick={() => adjustStock(product.id, "out")}>เบิกใช้</button></div>
                        </div>
                      ))}
                    </div>
                    <div className="section-note" style={{ marginTop: 15 }}>ระบบนี้บันทึกการเติมและเบิกใช้สต็อกตามที่เจ้าของร้านกรอก ยังไม่ตัดสต็อกอัตโนมัติตามสูตรการซัก เพื่อให้เจ้าของร้านควบคุมปริมาณการใช้จริงได้</div>
                    <h3 style={{ marginTop: 24 }}>ประวัติการเคลื่อนไหวสต็อก</h3>
                    {stockMovements.length === 0 ? <div className="empty"><PackageCheck size={30}/><p>ยังไม่มีประวัติการเติมหรือเบิกใช้</p></div> : <div className="table-wrap"><table><thead><tr><th>วันเวลา</th><th>ผลิตภัณฑ์</th><th>รายการ</th><th>จำนวน</th><th>คงเหลือหลังทำรายการ</th></tr></thead><tbody>{stockMovements.slice(0, 30).map((move) => <tr key={move.id}><td>{dateText(move.createdAt)}</td><td>{move.productName}</td><td><span className={`status-pill ${move.direction === "in" ? "green" : "orange"}`}>{move.direction === "in" ? "เติมสต็อก" : "เบิกใช้"}</span></td><td>{move.amount} {move.unit}</td><td>{move.stockAfter} {move.unit}</td></tr>)}</tbody></table></div>}
                  </>
                )}

                {adminTab === "reports" && (() => {
                  const monthBookings = bookings.filter((booking) => ((booking.paidAt || booking.createdAt || "").slice(0, 7) === reportMonth) && booking.paymentStatus === "ชำระเงินแล้ว" && booking.status !== "ยกเลิก");
                  const totalIncome = monthBookings.reduce((sum, booking) => sum + Number(booking.total || 0), 0);
                  const split = monthBookings.reduce((acc, booking) => {
                    const parts = booking.breakdown || calculateBreakdown(booking.items || [], booking.services || []);
                    acc.washing += Number(parts.washing || 0); acc.drying += Number(parts.drying || 0); acc.ironing += Number(parts.ironing || 0);
                    return acc;
                  }, { washing: 0, drying: 0, ironing: 0 });
                  const paidCount = monthBookings.length;
                  const unpaidCount = bookings.filter((booking) => (booking.createdAt || "").slice(0, 7) === reportMonth && booking.paymentStatus !== "ชำระเงินแล้ว" && booking.status !== "ยกเลิก").length;
                  return <div className="report-print-area">
                    <div className="section-head"><div><h2>รายงานรายได้</h2><p className="muted">สรุปรายรับจากรายการที่บันทึกว่าชำระเงินแล้วเท่านั้น · ประจำเดือน {reportMonth}</p></div><button className="button outline small-button no-print" onClick={printReport}><Printer size={14}/> พิมพ์รายงาน</button></div>
                    <div className="field no-print" style={{ maxWidth: 250 }}><label>เลือกเดือนที่ต้องการดู</label><input type="month" value={reportMonth} onChange={(e) => setReportMonth(e.target.value)}/></div>
                    <div className="report-highlight"><div><small>รายได้รวมเดือนนี้</small><strong>{money(totalIncome)} บาท</strong><span>{paidCount} รายการที่ชำระแล้ว</span></div><TrendingUp size={34}/></div>
                    <div className="dashboard-grid" style={{ marginTop: 15 }}>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>รายได้จากการซัก</span><WashingMachine size={18}/></div><strong>{money(split.washing)}</strong><small>บาท</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>รายได้จากการอบ</span><Wind size={18}/></div><strong>{money(split.drying)}</strong><small>บาท</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>รายได้จากการรีด</span><Sparkles size={18}/></div><strong>{money(split.ironing)}</strong><small>บาท</small></div>
                      <div className="dashboard-stat"><div className="dashboard-stat-top"><span>ค้างชำระ</span><Clock size={18}/></div><strong>{unpaidCount}</strong><small>รายการ</small></div>
                    </div>
                    <h3 style={{ marginTop: 24 }}>รายการรับชำระประจำเดือน</h3>
                    {monthBookings.length === 0 ? <div className="empty"><Banknote size={30}/><p>ยังไม่มีรายการชำระเงินในเดือนนี้</p></div> : <div className="table-wrap"><table><thead><tr><th>วันที่จอง</th><th>เลขที่จอง</th><th>ลูกค้า</th><th>บริการ</th><th>ยอดรับ</th></tr></thead><tbody>{monthBookings.map((booking) => <tr key={booking.id}><td>{dateText(booking.createdAt)}</td><td>{booking.id}</td><td>{booking.name}</td><td>{(booking.services || []).join(", ")}</td><td><strong>{money(booking.total)} บาท</strong></td></tr>)}</tbody></table></div>}
                    <div className="section-note" style={{ marginTop: 15 }}>รายงานนี้อิงวันที่สร้างรายการจองและสถานะชำระเงินใน DEMO ไม่ใช่บัญชีรายรับตามมาตรฐานภาษี และยังไม่หักต้นทุนหรือค่าใช้จ่ายเพื่อคำนวณกำไรสุทธิ</div>
                  </div>;
                })()}

                {adminTab === "calculator" && (
                  <>
                    <h2>เครื่องคิดเลขเจ้าของร้าน</h2><p className="muted">ใช้คำนวณยอดบริการ เงินทอน ส่วนลด หรือรายการทั่วไป โดยไม่บันทึกเป็นรายรับอัตโนมัติ</p>
                    <div className="calculator-panel">
                      <div className="calculator-display"><small>{calculatorExpression || "เครื่องคิดเลข"}</small><strong>{calculatorValue}</strong></div>
                      <div className="calculator-keys">{["C","(",")","÷","7","8","9","×","4","5","6","-","1","2","3","+","0",".","⌫","="].map((key) => <button key={key} className={key === "=" ? "equals" : ["C","÷","×","-","+","⌫"].includes(key) ? "operator" : ""} onClick={() => pressCalculator(key)}>{key}</button>)}</div>
                    </div>
                    <div className="card" style={{ maxWidth: 380, margin: "0 auto" }}><h3>ประวัติการคำนวณล่าสุด</h3>{calculatorHistory.length ? calculatorHistory.map((item, index) => <div className="customer-row" key={`${item.expression}-${index}`}><span className="muted">{item.expression} =</span><strong>{item.result}</strong></div>) : <p className="muted">ยังไม่มีประวัติการคำนวณ</p>}</div>
                  </>
                )}

                {adminTab === "shop" && (
                  <>
                    <h2>จัดการสถานะการเปิดให้บริการ</h2>
                    <div className={`shop-status ${shopOpen ? "open" : "closed"}`}>
                      <div className="status-main">
                        <Store size={28} />
                        <div>
                          <h3>{shopOpen ? "ร้านเปิดให้บริการ" : "ร้านปิดให้บริการชั่วคราว"}</h3>
                          <p>{shopMessage}</p>
                        </div>
                      </div>
                      <span className={`status-pill ${shopOpen ? "green" : "red"}`}>{shopOpen ? "เปิด" : "ปิด"}</span>
                    </div>
                    <div className="field">
                      <label>สถานะร้าน</label>
                      <div className="choice-grid">
                        <button type="button" className={`choice ${shopOpen ? "selected" : ""}`} onClick={() => setShopOpen(true)}>
                          <Check size={23} color="#24965c" /><div><h3>เปิดให้บริการ</h3><p>เปิดรับผ้าและรับจองคิวตามปกติ</p></div>
                        </button>
                        <button type="button" className={`choice ${!shopOpen ? "selected" : ""}`} onClick={() => setShopOpen(false)}>
                          <X size={23} color="#c6534d" /><div><h3>ปิดให้บริการชั่วคราว</h3><p>งดรับผ้าและปิดการจองคิวชั่วคราว</p></div>
                        </button>
                      </div>
                    </div>
                    <div className="field">
                      <label>เหตุผลที่ปิดร้าน</label>
                      <select value={shopReason} onChange={(e) => setShopReason(e.target.value)}>
                        <option>เจ้าของร้านไม่สบาย</option>
                        <option>เจ้าของร้านมีธุระส่วนตัว</option>
                        <option>หยุดพักผ่อน</option>
                        <option>ร้านหยุดปรับปรุง</option>
                        <option>เหตุขัดข้องภายในร้าน</option>
                        <option>อื่น ๆ</option>
                      </select>
                    </div>
                    <div className="field">
                      <label>ข้อความประกาศให้ลูกค้าทราบ</label>
                      <textarea value={shopMessage} onChange={(e) => setShopMessage(e.target.value)} placeholder="เขียนข้อความแจ้งลูกค้า" />
                    </div>
                    <button className="button primary" onClick={() => showNotice("อัปเดตสถานะร้านแล้ว")}><Save size={16} /> บันทึกสถานะร้าน</button>
                    <div className="section-note" style={{ marginTop: 15 }}>
                      เมื่อเปลี่ยนสถานะร้าน ลูกค้าจะเห็นข้อมูลบนหน้าแรกทันที และเมื่อร้านปิด ระบบจะไม่อนุญาตให้ส่งรายการจองใหม่
                    </div>
                  </>
                )}

                {adminTab === "appearance" && (
                  <>
                    <div className="section-head" style={{ marginBottom: 20 }}>
                      <div>
                        <h2>ปรับแต่งธีมเว็บไซต์</h2>
                        <p>เลือกสีพื้นหลัง สีตัวอักษร และขนาดข้อความได้ตามต้องการ</p>
                      </div>
                      <button className="button outline small-button" onClick={resetTheme}>คืนค่าเริ่มต้น</button>
                    </div>

                    <div className="theme-preview" style={{ background: theme.pageBg, color: theme.text, borderColor: theme.navBg }}>
                      <div className="theme-preview-nav" style={{ background: `${theme.navBg}${Math.round(theme.navOpacity * 2.55).toString(16).padStart(2, "0")}`, color: theme.heading }}>
                        <strong>DEMO Laundry</strong><span>ตัวอย่างแถบเมนูโปร่งแสง</span>
                      </div>
                      <div className="theme-preview-card" style={{ background: theme.surface }}>
                        <strong style={{ color: theme.heading }}>ตัวอย่างหัวข้อเว็บไซต์</strong>
                        <p style={{ color: theme.text, fontSize: `${theme.fontSize}px` }}>ตัวอย่างข้อความและรายละเอียด เพื่อทดสอบความชัดเจนในการอ่าน</p>
                        <button type="button" className="button primary" style={{ background: theme.primary }}>ปุ่มตัวอย่าง</button>
                      </div>
                    </div>

                    <div className="theme-control-grid">
                      {[
                        ["pageBg", "สีพื้นหลังเว็บไซต์", "พื้นหลังหลักของทุกหน้า"],
                        ["surface", "สีพื้นหลังการ์ดและกล่อง", "การ์ดข้อมูล ตาราง และแผงเนื้อหา"],
                        ["accentBg", "สีพื้นหลังองค์ประกอบรอง", "ไอคอน ปุ่มรอง และส่วนที่เน้นข้อมูล"],
                        ["border", "สีเส้นขอบองค์ประกอบ", "กรอบการ์ด ช่องกรอก และเส้นแบ่ง"],
                        ["navBg", "สีพื้นหลัง Navbar", "สีของแถบเมนูด้านบน"],
                        ["primary", "สีปุ่มหลัก", "ปุ่มยืนยัน บันทึก และดำเนินการ"],
                        ["heading", "สีหัวข้อ", "หัวข้อหน้า ชื่อส่วน และหัวข้อการ์ด"],
                        ["text", "สีตัวอักษรหลัก", "ข้อความทั่วไปและรายละเอียด"],
                        ["muted", "สีข้อความรอง", "คำอธิบาย ข้อความช่วยเหลือ และรายละเอียดรอง"],
                      ].map(([key, label, description]) => (
                        <label className="theme-color-control" key={key}>
                          <span><strong>{label}</strong><small>{description}</small></span>
                          <input type="color" value={theme[key]} onChange={(e) => updateTheme(key, e.target.value)} aria-label={label} />
                        </label>
                      ))}
                    </div>

                    <div className="theme-range-control">
                      <div><strong>ความโปร่งใสของ Navbar</strong><span>{theme.navOpacity}%</span></div>
                      <input type="range" min="10" max="100" step="5" value={theme.navOpacity} onChange={(e) => updateTheme("navOpacity", Number(e.target.value))} />
                      <small>ค่าน้อยจะโปร่งใสมาก ค่าสูงจะทึบมาก</small>
                    </div>
                    <div className="theme-range-control">
                      <div><strong>ขนาดตัวอักษร</strong><span>{theme.fontSize}px</span></div>
                      <input type="range" min="13" max="19" step="1" value={theme.fontSize} onChange={(e) => updateTheme("fontSize", Number(e.target.value))} />
                      <small>ปรับขนาดข้อความทั่วไปให้เหมาะกับการอ่าน</small>
                    </div>
                    <div className="section-note" style={{ marginTop: 16 }}>
                      การเปลี่ยนสีจะแสดงผลทันที และบันทึกไว้ในเบราว์เซอร์นี้โดยอัตโนมัติ การคืนค่าเริ่มต้นจะเปลี่ยนกลับเป็นธีมฟ้า–ขาวของ DEMO Laundry
                    </div>
                  </>
                )}
              </section>
            </div>
          </>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <strong>DEMO Laundry</strong>
          <p>ตัวอย่างเว็บไซต์ระบบจัดการร้านซักอบรีด</p>
          <span>DEMO VERSION · ข้อมูลตัวอย่างสำหรับการนำเสนอ</span>
          <div style={{ marginTop: 12 }}>
            <button className="button secondary small-button" onClick={() => goTo("guide")}>
              <BookOpen size={14} /> เปิดคู่มือการใช้งาน
            </button>
          </div>
        </div>
      </footer>
      </>
      )}

      {notice && <div className="notice">{notice}</div>}
    </div>
  );
}

export default App;