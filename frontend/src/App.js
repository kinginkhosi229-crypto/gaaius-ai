import { useState, useEffect, useRef, useCallback } from "react";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { create } from "zustand";
import "@/App.css";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  MessageSquare, Image, Video, Mic, MicOff, Send, Plus, Trash2, Volume2,
  Loader2, Sparkles, Zap, Menu, X, Download, User, LogOut, Crown, Music,
  FileCode, FolderOpen, Hammer, Eye, Code, Settings, CreditCard, Edit, Save,
  Terminal, Play, ChevronRight, File, Folder, RefreshCw, Copy, Check
} from "lucide-react";
import Editor from "@monaco-editor/react";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Zustand store for auth
const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("gaaius_token"),
  setUser: (user) => set({ user }),
  setToken: (token) => {
    if (token) localStorage.setItem("gaaius_token", token);
    else localStorage.removeItem("gaaius_token");
    set({ token });
  },
  logout: () => {
    localStorage.removeItem("gaaius_token");
    set({ user: null, token: null });
  }
}));

// API helper with auth
const api = axios.create({ baseURL: API });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("gaaius_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Mode configurations
const MODES = {
  chat: { icon: MessageSquare, label: "Chat", color: "text-purple-400", bgColor: "bg-purple-500/20", borderColor: "border-purple-500/30" },
  image: { icon: Image, label: "Image", color: "text-cyan-400", bgColor: "bg-cyan-500/20", borderColor: "border-cyan-500/30" },
  video: { icon: Video, label: "Video", color: "text-orange-400", bgColor: "bg-orange-500/20", borderColor: "border-orange-500/30" },
  audio: { icon: Music, label: "Audio", color: "text-green-400", bgColor: "bg-green-500/20", borderColor: "border-green-500/30" },
  file: { icon: FileCode, label: "Files", color: "text-pink-400", bgColor: "bg-pink-500/20", borderColor: "border-pink-500/30" }
};

// Auth Modal Component
const AuthModal = ({ open, onClose, onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser, setToken } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const data = isLogin ? { email, password } : { email, password, name };
      const res = await api.post(endpoint, data);
      setToken(res.data.token);
      setUser(res.data.user);
      toast.success(isLogin ? "Welcome back!" : "Account created!");
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-secondary">{isLogin ? "Welcome Back" : "Create Account"}</DialogTitle>
          <DialogDescription>Sign in to access all GAAIUS AI features</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-white/5 border-white/10" />
          )}
          <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-white/5 border-white/10" required />
          <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="bg-white/5 border-white/10" required />
          <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (isLogin ? "Sign In" : "Sign Up")}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-primary hover:underline">
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Profile Modal Component
const ProfileModal = ({ open, onClose }) => {
  const { user, logout } = useAuthStore();
  const [name, setName] = useState(user?.name || "");
  
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-secondary flex items-center gap-2">
            <User className="w-5 h-5 text-primary" /> My Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <p className="font-semibold">{user.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
              {user.is_pro && <span className="text-xs text-yellow-400 flex items-center gap-1"><Crown className="w-3 h-3" /> Pro Member</span>}
            </div>
          </div>
          
          <div className="glass-light rounded-xl p-4 space-y-3">
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <p className="text-sm">{user.email}</p>
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Account Type</label>
              <p className="text-sm">{user.is_pro ? "Pro" : "Free"}</p>
            </div>
          </div>
          
          <Button onClick={() => { logout(); onClose(); }} variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
            <LogOut className="w-4 h-4 mr-2" /> Sign Out
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Pro Upgrade Modal with PayPal
const ProModal = ({ open, onClose }) => {
  const { user, setUser } = useAuthStore();
  const [paypalClientId, setPaypalClientId] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/payment/config").then(res => setPaypalClientId(res.data.paypal_client_id)).catch(() => {});
  }, []);

  const handlePayPalApprove = async (data) => {
    setLoading(true);
    try {
      const res = await api.post(`/payment/paypal/capture/${data.orderID}`);
      if (res.data.success) {
        setUser({ ...user, is_pro: true });
        toast.success("Pro activated! Enjoy ad-free GAAIUS AI!");
        onClose();
      }
    } catch (error) {
      toast.error("Payment failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePayFast = async () => {
    try {
      const res = await api.post("/payment/payfast/create");
      const form = document.createElement("form");
      form.method = "POST";
      form.action = res.data.payment_url;
      Object.entries(res.data.data).forEach(([key, value]) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = value;
        form.appendChild(input);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (error) {
      toast.error("PayFast error");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-white/10 max-w-md">
        <DialogHeader>
          <DialogTitle className="font-secondary flex items-center gap-2">
            <Crown className="w-5 h-5 text-yellow-400" /> Upgrade to Pro
          </DialogTitle>
          <DialogDescription>Remove all ads and get unlimited access for just $1/month</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="glass-light rounded-xl p-4">
            <h3 className="font-semibold mb-2">Pro Benefits:</h3>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ No ads - ever!</li>
              <li>✓ Priority generation</li>
              <li>✓ Longer videos (up to 60s)</li>
              <li>✓ HD image exports</li>
              <li>✓ Early access to new features</li>
            </ul>
          </div>
          
          {paypalClientId && (
            <PayPalScriptProvider options={{ clientId: paypalClientId, currency: "USD" }}>
              <PayPalButtons
                style={{ layout: "vertical", color: "gold", shape: "pill" }}
                createOrder={(data, actions) => actions.order.create({
                  purchase_units: [{ amount: { value: "1.00" }, description: "GAAIUS AI Pro - 1 Month" }]
                })}
                onApprove={handlePayPalApprove}
                onError={() => toast.error("PayPal error")}
              />
            </PayPalScriptProvider>
          )}
          
          <div className="text-center text-muted-foreground text-sm">or</div>
          
          <Button onClick={handlePayFast} variant="outline" className="w-full border-green-500/30 text-green-400 hover:bg-green-500/10">
            <CreditCard className="w-4 h-4 mr-2" /> Pay with PayFast (South Africa)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Ad Component - Only shows for logged out users
const AdBanner = ({ onUpgrade }) => {
  const ads = [
    { text: "🚀 Sign in to unlock all GAAIUS AI features!", cta: "Sign In" },
    { text: "⚡ Create an account for unlimited AI generations!", cta: "Get Started" },
    { text: "🎨 Sign in to save your work and access Pro features!", cta: "Sign In" }
  ];
  const [ad] = useState(ads[Math.floor(Math.random() * ads.length)]);

  return (
    <div className="w-full p-2 glass border-t border-primary/30">
      <div className="max-w-4xl mx-auto flex items-center justify-between">
        <p className="text-xs">{ad.text}</p>
        <Button size="sm" onClick={onUpgrade} className="bg-primary hover:bg-primary/90 text-white text-xs px-2 py-1 h-7">
          {ad.cta}
        </Button>
      </div>
    </div>
  );
};

// Chat Message Component - Removed model labels
const ChatMessage = ({ message, onSpeak }) => {
  const isUser = message.role === "user";
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`} data-testid={`message-${message.id}`}>
      <div className={`max-w-[80%] ${isUser ? "bg-primary/20 border-primary/30 rounded-br-sm" : "bg-secondary/50 border-white/5 rounded-bl-sm"} border rounded-2xl p-4`}>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
        {!isUser && (
          <button onClick={() => onSpeak(message.content)} className="mt-2 p-1.5 rounded-full hover:bg-white/10" data-testid="speak-button">
            <Volume2 className="w-4 h-4 text-muted-foreground hover:text-white" />
          </button>
        )}
      </div>
    </div>
  );
};

// Generation Result Component - Removed model labels
const GenerationResult = ({ data, type }) => {
  const rawUrl = data.url || data.image_url || data.video_url || data.audio_url || "";
  const url = rawUrl.startsWith("/api") ? `${BACKEND_URL}${rawUrl}` : rawUrl;
  if (!url) return null;

  return (
    <div className="glass rounded-2xl overflow-hidden" data-testid={`result-${data.id}`}>
      {type === "image" && <img src={url} alt={data.prompt} className="w-full h-auto" />}
      {type === "video" && <video src={url} controls className="w-full h-auto bg-black" />}
      {type === "audio" && <audio src={url} controls className="w-full mt-4" />}
      <div className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2">{data.prompt}</p>
        {type === "file" && data.content && (
          <pre className="mt-2 p-2 bg-black/50 rounded text-xs overflow-auto max-h-40">{data.content}</pre>
        )}
        <a href={url} download target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex items-center gap-2 text-xs text-primary hover:text-primary/80">
          <Download className="w-3 h-3" /> Download
        </a>
      </div>
    </div>
  );
};

// Build Page Component - GAAIUS AI Builder (Full-featured: AI Chat + Image Gen + Live Preview)
const BuildPage = ({ showSidebar = false, navigate, user, showAuth, showPro, showProfile, logout }) => {
  const [prompt, setPrompt] = useState("");
  const [htmlContent, setHtmlContent] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { font-family: 'Inter', sans-serif; }
  </style>
</head>
<body class="bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white min-h-screen">
  <nav class="fixed top-0 w-full bg-black/50 backdrop-blur-xl border-b border-white/10 z-50">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <h1 class="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">MyApp</h1>
      <div class="flex gap-4">
        <a href="#" class="text-gray-300 hover:text-white transition">Features</a>
        <a href="#" class="text-gray-300 hover:text-white transition">Pricing</a>
        <button class="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg font-medium transition">Get Started</button>
      </div>
    </div>
  </nav>
  <main class="pt-24 px-6">
    <div class="max-w-4xl mx-auto text-center py-20">
      <h2 class="text-5xl font-bold mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">Build Something Amazing</h2>
      <p class="text-xl text-gray-400 mb-8">Tell GAAIUS AI what you want to build and watch it come to life instantly.</p>
      <button class="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-4 rounded-xl font-semibold text-lg transition transform hover:scale-105">Start Building →</button>
    </div>
  </main>
</body>
</html>`);
  const [loading, setLoading] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [generatedImages, setGeneratedImages] = useState([]);
  const [activeTab, setActiveTab] = useState("chat");
  const nav = useNavigate();
  
  // NEW: Multi-file project support
  const [projectFiles, setProjectFiles] = useState({
    "index.html": `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My App</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="styles.css">
</head>
<body class="bg-gray-900 text-white min-h-screen">
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`,
    "styles.css": `/* Custom styles */
body {
  font-family: 'Inter', system-ui, sans-serif;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}`,
    "app.js": `// Main application logic
console.log('GAAIUS AI Builder - App Started');

document.addEventListener('DOMContentLoaded', () => {
  const app = document.getElementById('app');
  app.innerHTML = '<h1 class="text-4xl font-bold text-center py-20">Welcome to Your App</h1>';
});`
  });
  const [activeFile, setActiveFile] = useState("index.html");
  const [rightPanelTab, setRightPanelTab] = useState("preview"); // preview | code | terminal
  const [terminalOutput, setTerminalOutput] = useState([
    { type: "system", text: "GAAIUS AI Builder Terminal v1.0" },
    { type: "system", text: "Ready for commands..." }
  ]);
  const [showFileTree, setShowFileTree] = useState(true);

  // Get file language for Monaco
  const getLanguage = (filename) => {
    const ext = filename.split('.').pop();
    const langMap = {
      'html': 'html',
      'css': 'css',
      'js': 'javascript',
      'jsx': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'json': 'json',
      'py': 'python',
      'md': 'markdown'
    };
    return langMap[ext] || 'plaintext';
  };

  // Add terminal log
  const addTerminalLog = (type, text) => {
    setTerminalOutput(prev => [...prev, { type, text, timestamp: new Date().toLocaleTimeString() }]);
  };

  // Create new file
  const createNewFile = (filename) => {
    if (projectFiles[filename]) {
      toast.error("File already exists");
      return;
    }
    const ext = filename.split('.').pop();
    let defaultContent = "";
    if (ext === 'html') defaultContent = "<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  \n</body>\n</html>";
    if (ext === 'css') defaultContent = "/* New stylesheet */\n";
    if (ext === 'js') defaultContent = "// New JavaScript file\n";
    
    setProjectFiles(prev => ({ ...prev, [filename]: defaultContent }));
    setActiveFile(filename);
    addTerminalLog("success", `Created file: ${filename}`);
    toast.success(`Created ${filename}`);
  };

  // Delete file
  const deleteFile = (filename) => {
    if (Object.keys(projectFiles).length <= 1) {
      toast.error("Cannot delete the last file");
      return;
    }
    const newFiles = { ...projectFiles };
    delete newFiles[filename];
    setProjectFiles(newFiles);
    if (activeFile === filename) {
      setActiveFile(Object.keys(newFiles)[0]);
    }
    addTerminalLog("warning", `Deleted file: ${filename}`);
    toast.success(`Deleted ${filename}`);
  };

  // Update file content
  const updateFileContent = (content) => {
    setProjectFiles(prev => ({ ...prev, [activeFile]: content }));
    // Also update htmlContent if it's index.html for preview compatibility
    if (activeFile === "index.html") {
      setHtmlContent(content);
    }
  };

  // Build combined HTML for preview (combines all files)
  const buildPreviewHtml = () => {
    let html = projectFiles["index.html"] || htmlContent;
    
    // Inject CSS if exists
    if (projectFiles["styles.css"]) {
      html = html.replace('</head>', `<style>${projectFiles["styles.css"]}</style></head>`);
    }
    
    // Inject JS if exists
    if (projectFiles["app.js"]) {
      html = html.replace('</body>', `<script>${projectFiles["app.js"]}</script></body>`);
    }
    
    return html;
  };

  // Generate image using Pollinations AI (free, no API key needed)
  const generateImage = async (imagePrompt) => {
    setImageLoading(true);
    try {
      const encodedPrompt = encodeURIComponent(imagePrompt);
      const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=512&height=512&nologo=true`;
      
      // Pre-load the image to ensure it's generated
      const img = new window.Image();
      img.onload = () => {
        setGeneratedImages(prev => [{
          id: Date.now(),
          prompt: imagePrompt,
          url: imageUrl,
          timestamp: new Date().toISOString()
        }, ...prev]);
        setChatHistory(prev => [...prev, { 
          role: "assistant", 
          content: `🎨 Image generated! Click to copy the URL and use it in your code.\n\nURL: ${imageUrl}`,
          imageUrl: imageUrl
        }]);
        toast.success("Image generated!");
        setImageLoading(false);
      };
      img.onerror = () => {
        toast.error("Image generation failed");
        setImageLoading(false);
      };
      img.src = imageUrl;
    } catch (error) {
      toast.error("Image generation failed");
      setImageLoading(false);
    }
  };

  // Copy image URL to clipboard
  const copyImageUrl = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Image URL copied! Paste it in your code.");
  };

  // Insert image into HTML
  const insertImageIntoCode = (url) => {
    const imgTag = `<img src="${url}" alt="Generated image" class="w-full max-w-md mx-auto rounded-lg shadow-lg" />`;
    setHtmlContent(prev => {
      // Insert before </main> or </body>
      if (prev.includes('</main>')) {
        return prev.replace('</main>', `  ${imgTag}\n</main>`);
      }
      return prev.replace('</body>', `  ${imgTag}\n</body>`);
    });
    toast.success("Image inserted into your code!");
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    
    const promptLower = prompt.toLowerCase();
    
    // Check if user wants to generate an image/logo/icon
    const isImageRequest = promptLower.includes('image') || 
                          promptLower.includes('logo') || 
                          promptLower.includes('icon') ||
                          promptLower.includes('picture') ||
                          promptLower.includes('graphic') ||
                          promptLower.includes('illustration') ||
                          promptLower.includes('banner') ||
                          promptLower.includes('background') ||
                          promptLower.includes('photo') ||
                          promptLower.includes('generate an image') ||
                          promptLower.includes('create an image') ||
                          promptLower.includes('make an image') ||
                          promptLower.includes('design a logo') ||
                          promptLower.includes('create a logo');
    
    setChatHistory(prev => [...prev, { role: "user", content: prompt }]);
    
    if (isImageRequest) {
      // Use Pollinations AI for image generation
      setPrompt("");
      addTerminalLog("info", `Generating image: ${prompt}`);
      await generateImage(prompt);
      return;
    }
    
    // Check if this is a complex app request (YouTube, Spotify, etc.)
    const isComplexApp = promptLower.includes('youtube') || 
                        promptLower.includes('spotify') ||
                        promptLower.includes('netflix') ||
                        promptLower.includes('twitter') ||
                        promptLower.includes('instagram') ||
                        promptLower.includes('amazon') ||
                        promptLower.includes('facebook') ||
                        promptLower.includes('tiktok') ||
                        promptLower.includes('linkedin') ||
                        promptLower.includes('reddit') ||
                        promptLower.includes('discord') ||
                        promptLower.includes('slack') ||
                        promptLower.includes('airbnb') ||
                        promptLower.includes('uber') ||
                        promptLower.includes('like') ||
                        promptLower.includes('clone') ||
                        promptLower.includes('similar to') ||
                        promptLower.includes('build a') ||
                        promptLower.includes('create a') ||
                        promptLower.includes('make a') ||
                        promptLower.includes('app') ||
                        promptLower.includes('website') ||
                        promptLower.includes('platform') ||
                        promptLower.includes('dashboard') ||
                        promptLower.includes('e-commerce') ||
                        promptLower.includes('ecommerce') ||
                        promptLower.includes('shop') ||
                        promptLower.includes('store') ||
                        promptLower.includes('blog') ||
                        promptLower.includes('portfolio') ||
                        promptLower.includes('landing page');
    
    // Use Groq for code generation
    setLoading(true);
    
    if (isComplexApp) {
      addTerminalLog("info", `🚀 Building complete application: ${prompt}`);
      setChatHistory(prev => [...prev, { role: "assistant", content: "🔨 Building your application... This may take a moment as I create a complete, production-ready version." }]);
    } else {
      addTerminalLog("info", `AI generating code for: ${prompt}`);
    }
    
    try {
      const res = await api.post("/build/generate", { 
        prompt, 
        current_code: projectFiles["index.html"] || htmlContent 
      }, { timeout: 120000 }); // 2 minute timeout for complex apps
      
      if (res.data.code) {
        // Update index.html with the generated code
        setProjectFiles(prev => ({ ...prev, "index.html": res.data.code }));
        setHtmlContent(res.data.code);
        setActiveFile("index.html");
        setRightPanelTab("preview"); // Switch to preview to show the result
        
        if (isComplexApp) {
          setChatHistory(prev => [...prev, { 
            role: "assistant", 
            content: `✅ Your application is ready! I've built a complete, functional version. Check the Preview tab to see it in action!\n\n💡 Tips:\n- Click "Preview" tab to see your app\n- Click "Code" tab to edit the source\n- Use "Save" to keep your project` 
          }]);
          addTerminalLog("success", `✅ Application built successfully!`);
        } else {
          setChatHistory(prev => [...prev, { role: "assistant", content: `✅ Done! Check the Preview tab to see your changes!` }]);
          addTerminalLog("success", `Code generated and saved to index.html`);
        }
        toast.success(isComplexApp ? "Application built!" : "Code updated!");
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { role: "assistant", content: "❌ I encountered an issue. Please try again with more specific details." }]);
      addTerminalLog("error", `Generation failed: ${error.message || "Unknown error"}`);
      toast.error("Generation failed - please try again");
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const handleSaveToProject = async () => {
    if (!projectName.trim()) return;
    try {
      addTerminalLog("info", `Saving project: ${projectName}`);
      const res = await api.post("/projects", { name: projectName, description: "Created from AI Builder", type: "web" });
      await api.put(`/projects/${res.data.id}/files`, projectFiles);
      addTerminalLog("success", `Project saved with ${Object.keys(projectFiles).length} files`);
      toast.success("Saved to project!");
      setShowSaveDialog(false);
      (navigate || nav)("/projects");
    } catch (error) {
      addTerminalLog("error", `Save failed: ${error.message}`);
      toast.error("Failed to save");
    }
  };

  const downloadProject = () => {
    // Download all files as combined HTML or as ZIP
    const combinedHtml = buildPreviewHtml();
    const blob = new Blob([combinedHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'website.html';
    a.click();
    URL.revokeObjectURL(url);
    addTerminalLog("success", "Project downloaded as website.html");
    toast.success("Website downloaded!");
  };

  return (
    <div className="h-full flex flex-col bg-[#0a0a0a]">
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent className="glass border-white/10">
          <DialogHeader><DialogTitle>Save to Project</DialogTitle></DialogHeader>
          <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project name..." className="bg-white/5 border-white/10" />
          <Button onClick={handleSaveToProject} className="w-full bg-primary">Save</Button>
        </DialogContent>
      </Dialog>
      
      {/* Header */}
      <div className="h-12 border-b border-white/10 flex items-center justify-between px-4 bg-[#111]">
        <div className="flex items-center gap-3">
          <Button size="sm" variant="ghost" onClick={() => (navigate || nav)("/")} className="h-7 text-xs">
            <X className="w-3 h-3 mr-1" /> Exit
          </Button>
          <div className="h-4 w-px bg-white/20" />
          <h2 className="font-secondary text-sm font-bold flex items-center gap-2">
            <Hammer className="w-4 h-4 text-orange-400" /> GAAIUS AI Builder
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={downloadProject} variant="outline" className="h-7 text-xs">
            <Download className="w-3 h-3 mr-1" /> Download
          </Button>
          <Button size="sm" onClick={() => setShowSaveDialog(true)} variant="default" className="h-7 text-xs bg-primary">
            <Save className="w-3 h-3 mr-1" /> Save
          </Button>
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left: AI Chat + Images Panel */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-[#0d0d0d]">
          {/* Tabs */}
          <div className="border-b border-white/10">
            <div className="flex">
              <button 
                onClick={() => setActiveTab("chat")}
                className={`flex-1 p-3 text-sm font-medium transition ${activeTab === "chat" ? "bg-orange-500/20 text-orange-400 border-b-2 border-orange-400" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Sparkles className="w-4 h-4 inline mr-2" />Build
              </button>
              <button 
                onClick={() => setActiveTab("images")}
                className={`flex-1 p-3 text-sm font-medium transition ${activeTab === "images" ? "bg-cyan-500/20 text-cyan-400 border-b-2 border-cyan-400" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Image className="w-4 h-4 inline mr-2" />Images ({generatedImages.length})
              </button>
            </div>
          </div>
          
          {activeTab === "chat" ? (
            <>
              <div className="p-4 border-b border-white/10">
                <p className="text-xs text-muted-foreground">
                  🚀 <strong>Build apps</strong>: "Create YouTube clone"<br/>
                  🎨 <strong>Generate images</strong>: "Create a logo for..."
                </p>
              </div>
              
              <ScrollArea className="flex-1 p-4">
                {chatHistory.length === 0 ? (
                  <div className="text-center py-6">
                    <Hammer className="w-12 h-12 text-orange-400/50 mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground mb-4">Build ANY app or website</p>
                    <div className="space-y-2 text-xs text-left">
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Build a YouTube clone with video grid, sidebar, and search")}>🎬 "Build a YouTube clone"</p>
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a Spotify-like music player with playlists and player controls")}>🎵 "Create a Spotify clone"</p>
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Build a Netflix homepage with hero banner and content rows")}>📺 "Build a Netflix homepage"</p>
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a Twitter/X feed with tweets, sidebar, and compose box")}>🐦 "Create a Twitter clone"</p>
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Build an Instagram profile page with photo grid and stories")}>📸 "Build Instagram UI"</p>
                      <p className="text-orange-400/70 cursor-pointer hover:text-orange-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create an Amazon-like e-commerce store with product grid and cart")}>🛒 "Create Amazon store"</p>
                      <p className="text-cyan-400/70 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a professional logo for a tech startup")}>🎨 "Create a logo"</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {chatHistory.map((msg, i) => (
                      <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-orange-500/20 ml-4 border border-orange-500/20" : "bg-white/5 mr-4"}`}>
                        <p className="text-xs text-muted-foreground mb-1">{msg.role === "user" ? "You" : "GAAIUS AI"}</p>
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                        {msg.imageUrl && (
                          <div className="mt-2">
                            <img src={msg.imageUrl} alt="Generated" className="w-full rounded-lg border border-white/10" />
                            <div className="flex gap-2 mt-2">
                              <Button size="sm" variant="outline" onClick={() => copyImageUrl(msg.imageUrl)} className="text-xs h-7 flex-1">
                                Copy URL
                              </Button>
                              <Button size="sm" variant="outline" onClick={() => insertImageIntoCode(msg.imageUrl)} className="text-xs h-7 flex-1 bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                                Insert to Code
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </>
          ) : (
            <ScrollArea className="flex-1 p-4">
              {generatedImages.length === 0 ? (
                <div className="text-center py-8">
                  <Image className="w-12 h-12 text-cyan-400/50 mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground mb-2">No images generated yet</p>
                  <p className="text-xs text-muted-foreground">Ask AI to "create a logo" or "generate an image"</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {generatedImages.map((img) => (
                    <div key={img.id} className="relative group">
                      <img src={img.url} alt={img.prompt} className="w-full rounded-lg border border-white/10" />
                      <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center p-2 rounded-lg">
                        <p className="text-xs text-center mb-2 line-clamp-2">{img.prompt}</p>
                        <div className="flex gap-1">
                          <Button size="sm" variant="ghost" onClick={() => copyImageUrl(img.url)} className="text-xs h-6 px-2">
                            Copy
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => insertImageIntoCode(img.url)} className="text-xs h-6 px-2 text-cyan-400">
                            Insert
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          )}
          
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Build website or generate image..."
                className="flex-1 bg-white/5 border-white/10"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button onClick={handleGenerate} disabled={loading || imageLoading} className="bg-orange-500 hover:bg-orange-600">
                {(loading || imageLoading) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Middle: File Tree (collapsible) */}
        {showFileTree && (
          <div className="w-48 border-r border-white/10 bg-[#0d0d0d] flex flex-col">
            <div className="p-2 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs font-mono text-muted-foreground uppercase">Files</span>
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-6 w-6 p-0"
                onClick={() => {
                  const name = window.prompt("New file name (e.g., page.html):");
                  if (name) createNewFile(name);
                }}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {Object.keys(projectFiles).map(filename => (
                  <div 
                    key={filename}
                    className={`flex items-center gap-2 p-1.5 rounded text-xs cursor-pointer group ${activeFile === filename ? "bg-orange-500/20 text-orange-400" : "hover:bg-white/5"}`}
                    onClick={() => setActiveFile(filename)}
                  >
                    <File className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate flex-1">{filename}</span>
                    {Object.keys(projectFiles).length > 1 && (
                      <button 
                        className="opacity-0 group-hover:opacity-100 hover:text-red-400 transition"
                        onClick={(e) => { e.stopPropagation(); deleteFile(filename); }}
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        )}
        
        {/* Right: Preview / Code / Terminal */}
        <div className="flex-1 flex flex-col">
          {/* Right Panel Tabs */}
          <div className="h-10 border-b border-white/10 flex items-center justify-between px-2 bg-[#111]">
            <div className="flex">
              <button 
                onClick={() => setRightPanelTab("preview")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${rightPanelTab === "preview" ? "bg-cyan-500/20 text-cyan-400" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Eye className="w-3.5 h-3.5" /> Preview
              </button>
              <button 
                onClick={() => setRightPanelTab("code")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${rightPanelTab === "code" ? "bg-green-500/20 text-green-400" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Code className="w-3.5 h-3.5" /> Code
              </button>
              <button 
                onClick={() => setRightPanelTab("terminal")}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition ${rightPanelTab === "terminal" ? "bg-purple-500/20 text-purple-400" : "text-muted-foreground hover:bg-white/5"}`}
              >
                <Terminal className="w-3.5 h-3.5" /> Terminal
              </button>
            </div>
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setShowFileTree(!showFileTree)}>
                <FolderOpen className="w-3 h-3 mr-1" /> {showFileTree ? "Hide" : "Show"} Files
              </Button>
              <div className="flex gap-1">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              </div>
            </div>
          </div>
          
          {/* Panel Content */}
          <div className="flex-1 overflow-hidden">
            {rightPanelTab === "preview" && (
              <div className="h-full bg-white">
                <iframe
                  srcDoc={buildPreviewHtml()}
                  className="w-full h-full border-0"
                  title="Preview"
                  sandbox="allow-scripts allow-same-origin"
                />
              </div>
            )}
            
            {rightPanelTab === "code" && (
              <div className="h-full flex flex-col">
                <div className="h-8 bg-[#1e1e1e] border-b border-white/10 flex items-center px-2">
                  <span className="text-xs font-mono text-muted-foreground">{activeFile}</span>
                </div>
                <Editor
                  height="100%"
                  language={getLanguage(activeFile)}
                  value={projectFiles[activeFile] || ""}
                  onChange={(value) => updateFileContent(value || "")}
                  theme="vs-dark"
                  options={{
                    minimap: { enabled: false },
                    fontSize: 13,
                    lineNumbers: "on",
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    tabSize: 2,
                    wordWrap: "on"
                  }}
                />
              </div>
            )}
            
            {rightPanelTab === "terminal" && (
              <div className="h-full bg-[#0d0d0d] font-mono text-xs p-3 overflow-auto">
                {terminalOutput.map((log, i) => (
                  <div key={i} className={`py-0.5 ${
                    log.type === "error" ? "text-red-400" : 
                    log.type === "success" ? "text-green-400" : 
                    log.type === "warning" ? "text-yellow-400" :
                    log.type === "info" ? "text-cyan-400" : "text-gray-400"
                  }`}>
                    <span className="text-gray-500">{log.timestamp || ""}</span> {log.text}
                  </div>
                ))}
                <div className="flex items-center mt-2 text-green-400">
                  <ChevronRight className="w-3 h-3 mr-1" />
                  <span className="animate-pulse">_</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Projects Page Component
const ProjectsPage = () => {
  const [projects, setProjects] = useState([]);
  const [newName, setNewName] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) api.get("/projects").then(res => setProjects(res.data)).catch(() => {});
  }, [user]);

  const createProject = async () => {
    if (!newName.trim()) {
      toast.error("Please enter a project name");
      return;
    }
    try {
      const res = await api.post("/projects", { name: newName, description: "", type: "web" });
      if (res.data && res.data.id) {
        setProjects(prev => [res.data, ...prev]);
        setNewName("");
        toast.success("Project created!");
      } else {
        throw new Error("Invalid response");
      }
    } catch (error) {
      console.error("Project creation error:", error);
      toast.error(error.response?.data?.detail || "Failed to create project");
    }
  };

  const openProject = (project) => {
    setSelectedProject(project);
  };

  if (!user) return (
    <div className="h-full flex items-center justify-center">
      <p className="text-muted-foreground">Please sign in to view projects</p>
    </div>
  );

  if (selectedProject) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={() => setSelectedProject(null)}>&larr; Back</Button>
          <h1 className="font-secondary text-2xl font-bold">{selectedProject.name}</h1>
        </div>
        
        <div className="glass rounded-xl p-6 space-y-4">
          <p className="text-muted-foreground">{selectedProject.description || "No description"}</p>
          <p className="text-xs text-muted-foreground">Created: {new Date(selectedProject.created_at).toLocaleDateString()}</p>
          
          {selectedProject.files && Object.keys(selectedProject.files).length > 0 ? (
            <div className="space-y-2">
              <h3 className="font-semibold">Files:</h3>
              {Object.entries(selectedProject.files).map(([name, content]) => (
                <div key={name} className="glass-light rounded-lg p-3">
                  <p className="text-sm font-mono">{name}</p>
                  <pre className="mt-2 text-xs overflow-auto max-h-40">{content}</pre>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">No files yet. Go to Build to create content.</p>
          )}
          
          <Button onClick={() => navigate("/build")} className="bg-primary">
            <Hammer className="w-4 h-4 mr-2" /> Open in Build
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="font-secondary text-2xl font-bold mb-6 flex items-center gap-2">
        <FolderOpen className="w-6 h-6 text-primary" /> My Projects
      </h1>
      
      <div className="flex gap-2 mb-6">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="New project name..." className="bg-white/5 border-white/10" />
        <Button onClick={createProject} className="bg-primary"><Plus className="w-4 h-4 mr-2" /> Create</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {projects.map(project => (
          <div 
            key={project.id} 
            onClick={() => openProject(project)}
            className="glass rounded-xl p-4 hover:border-primary/50 border border-white/10 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <h3 className="font-semibold">{project.name}</h3>
            <p className="text-sm text-muted-foreground mt-1">{project.description || "No description"}</p>
            <p className="text-xs text-muted-foreground mt-2">Created: {new Date(project.created_at).toLocaleDateString()}</p>
          </div>
        ))}
        {projects.length === 0 && (
          <p className="text-muted-foreground col-span-2 text-center py-8">No projects yet. Create your first one!</p>
        )}
      </div>
    </div>
  );
};

// GAAIUS AI Document Studio - AI-First Document Creation & Editing Platform
const DocumentStudio = ({ onBack }) => {
  const [prompt, setPrompt] = useState("");
  const [documentContent, setDocumentContent] = useState("");
  const [documentType, setDocumentType] = useState("invoice");
  const [documentName, setDocumentName] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("create");
  const [generatedFiles, setGeneratedFiles] = useState([]);
  const [invoiceType, setInvoiceType] = useState("standard");
  const [downloadFormat, setDownloadFormat] = useState("pdf");
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { user } = useAuthStore();

  // Auto-generate document name from first prompt
  const generateDocumentName = (promptText) => {
    const words = promptText.toLowerCase().split(' ');
    // Find key words to create a meaningful name
    const keyWords = ['invoice', 'quote', 'receipt', 'contract', 'proposal', 'report', 'letter', 'resume', 'nda'];
    const clientMatch = promptText.match(/(?:client|for|to)[:\s]+([A-Z][a-zA-Z\s]+?)(?:,|\.|\s+(?:project|amount|services|total))/i);
    const amountMatch = promptText.match(/\$[\d,]+(?:\.\d{2})?/);
    
    let name = "";
    
    // Find document type word
    const typeWord = keyWords.find(kw => words.includes(kw)) || documentType;
    name = typeWord.charAt(0).toUpperCase() + typeWord.slice(1);
    
    // Add client name if found
    if (clientMatch && clientMatch[1]) {
      name += ` - ${clientMatch[1].trim()}`;
    }
    
    // Add amount if found
    if (amountMatch) {
      name += ` ${amountMatch[0]}`;
    }
    
    // If name is too short, use first few meaningful words
    if (name.length < 10) {
      const meaningfulWords = words.filter(w => w.length > 3 && !['create', 'make', 'generate', 'professional', 'please', 'with', 'that', 'this', 'from'].includes(w));
      name = meaningfulWords.slice(0, 3).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    
    return name || `${documentType.charAt(0).toUpperCase() + documentType.slice(1)} ${new Date().toLocaleDateString()}`;
  };

  const documentTypes = [
    { id: "invoice", label: "Invoice", icon: "🧾", description: "Professional invoices" },
    { id: "contract", label: "Contract/Agreement", icon: "⚖️", description: "Legal contracts" },
    { id: "proposal", label: "Business Proposal", icon: "💼", description: "Project proposals" },
    { id: "resume", label: "CV/Resume", icon: "👤", description: "Professional resumes" },
    { id: "letter", label: "Business Letter", icon: "✉️", description: "Formal letters" },
    { id: "report", label: "Report", icon: "📋", description: "Business reports" },
    { id: "pdf", label: "PDF Document", icon: "📄", description: "General PDF" },
    { id: "docx", label: "Word Document", icon: "📝", description: "MS Word format" },
    { id: "xlsx", label: "Excel Spreadsheet", icon: "📊", description: "Data spreadsheets" },
    { id: "nda", label: "NDA Agreement", icon: "🔒", description: "Non-disclosure" },
    { id: "quotation", label: "Quotation/Quote", icon: "💰", description: "Price quotes" },
    { id: "receipt", label: "Receipt", icon: "🧾", description: "Payment receipts" }
  ];

  const invoiceTypes = [
    { id: "standard", label: "Standard Invoice", description: "Basic invoice for products/services" },
    { id: "freelance", label: "Freelancer Invoice", description: "For independent contractors" },
    { id: "consulting", label: "Consulting Invoice", description: "Professional consulting services" },
    { id: "recurring", label: "Recurring Invoice", description: "Monthly/weekly billing" },
    { id: "proforma", label: "Proforma Invoice", description: "Preliminary bill before delivery" },
    { id: "commercial", label: "Commercial Invoice", description: "International trade/export" },
    { id: "credit", label: "Credit Note", description: "Refund or adjustment" },
    { id: "debit", label: "Debit Note", description: "Additional charges" },
    { id: "timesheet", label: "Timesheet Invoice", description: "Hourly/daily billing" },
    { id: "milestone", label: "Milestone Invoice", description: "Project milestone billing" }
  ];

  const quickTemplates = {
    invoice: [
      { label: "Web Development Invoice", prompt: "Create a professional web development invoice for a React website project. Client: ABC Corp, Amount: $5,000, 50% deposit paid, balance due in 30 days. Include itemized services: Frontend development, Backend API, Database setup, Testing & QA." },
      { label: "Freelance Design Invoice", prompt: "Create a freelancer invoice for graphic design services. Client: XYZ Marketing, Services: Logo design ($500), Brand guidelines ($300), Social media templates ($200). Total: $1,000, Net 15 payment terms." },
      { label: "Consulting Services Invoice", prompt: "Create a consulting invoice for business strategy consulting. Client: StartupCo, Rate: $150/hour, Hours: 20, Total: $3,000. Include consultation sessions, market analysis, and strategic recommendations." },
      { label: "SaaS Subscription Invoice", prompt: "Create a recurring subscription invoice for SaaS software. Client: Enterprise Ltd, Plan: Professional ($299/month), Add-ons: Priority support ($50), Extra storage ($25). Total: $374/month." }
    ],
    contract: [
      { label: "Freelance Contract", prompt: "Create a freelance services contract for web development. Include scope of work, payment terms (50% upfront, 50% on completion), timeline (6 weeks), intellectual property transfer, and termination clause." },
      { label: "NDA Agreement", prompt: "Create a mutual non-disclosure agreement for business partnership discussions. Include confidentiality obligations, exclusions, term (2 years), and governing law." },
      { label: "Service Agreement", prompt: "Create a professional services agreement for ongoing marketing services. Monthly retainer: $2,500, deliverables, reporting requirements, and 30-day termination notice." }
    ],
    proposal: [
      { label: "Web Project Proposal", prompt: "Create a comprehensive web development proposal for an e-commerce website. Include executive summary, scope, timeline (12 weeks), team, technology stack (React, Node.js, PostgreSQL), pricing tiers, and terms." },
      { label: "Marketing Proposal", prompt: "Create a digital marketing proposal for a B2B company. Include current situation analysis, proposed strategy, deliverables (SEO, PPC, content marketing), KPIs, budget ($5,000/month), and ROI projections." }
    ],
    quotation: [
      { label: "Service Quotation", prompt: "Create a detailed quotation for IT support services. Include monthly support package ($1,500), on-site visits ($150/hour), hardware procurement (at cost + 10%), and software licensing management." },
      { label: "Product Quote", prompt: "Create a product quotation for office furniture supply. Items: 20 ergonomic chairs ($350 each), 20 standing desks ($500 each), 5 conference tables ($800 each). Include bulk discount 10%, delivery, and installation." }
    ],
    receipt: [
      { label: "Payment Receipt", prompt: "Create a payment receipt for consulting services. Client: Tech Solutions Inc, Amount: $2,500, Payment method: Bank Transfer, Date: Today, Reference: INV-2024-001" },
      { label: "Sales Receipt", prompt: "Create a sales receipt for software license purchase. Customer: Digital Agency, Product: Enterprise License, Amount: $999, Payment: Credit Card ending 4242" }
    ]
  };

  const handleGenerate = async () => {
    if (!prompt.trim() || loading) return;
    setLoading(true);
    
    // Auto-generate document name if empty
    if (!documentName.trim()) {
      setDocumentName(generateDocumentName(prompt));
    }
    
    // Build enhanced prompt based on document type
    let enhancedPrompt = prompt;
    if (documentType === "invoice" && invoiceType !== "standard") {
      enhancedPrompt = `Create a ${invoiceTypes.find(t => t.id === invoiceType)?.label || invoiceType} invoice. ${prompt}`;
    }
    
    setChatHistory(prev => [...prev, { role: "user", content: prompt }]);
    
    try {
      const res = await api.post("/document/generate-professional", { 
        prompt: enhancedPrompt, 
        document_type: documentType,
        current_content: documentContent,
        document_name: documentName || generateDocumentName(prompt),
        output_format: downloadFormat
      });
      
      if (res.data.content) {
        setDocumentContent(res.data.content);
      }
      if (res.data.file_url) {
        const fileName = documentName || generateDocumentName(prompt);
        setGeneratedFiles(prev => [{ 
          name: res.data.filename || `${fileName}.${res.data.format || 'pdf'}`,
          url: res.data.file_url,
          type: documentType,
          format: res.data.format || 'pdf',
          timestamp: new Date().toISOString()
        }, ...prev]);
      }
      
      // Auto-set document name if not set
      if (!documentName.trim()) {
        setDocumentName(generateDocumentName(prompt));
      }
      
      setChatHistory(prev => [...prev, { 
        role: "assistant", 
        content: res.data.message || `✅ Your ${documentType} has been created! You can preview and edit it on the right, then download as PDF.`
      }]);
      toast.success("Document generated!");
    } catch (error) {
      // Fallback to regular document generation
      try {
        const fallbackRes = await api.post("/document/generate", { 
          prompt: enhancedPrompt, 
          document_type: documentType,
          document_name: documentName || generateDocumentName(prompt)
        });
        if (fallbackRes.data) {
          setDocumentContent(fallbackRes.data.content || "");
          if (fallbackRes.data.file_url) {
            setGeneratedFiles(prev => [{ 
              name: `${documentName || generateDocumentName(prompt)}.pdf`,
              url: fallbackRes.data.file_url,
              type: documentType,
              format: 'pdf',
              timestamp: new Date().toISOString()
            }, ...prev]);
          }
          if (!documentName.trim()) {
            setDocumentName(generateDocumentName(prompt));
          }
          setChatHistory(prev => [...prev, { 
            role: "assistant", 
            content: "✅ Document created! You can edit it in the preview panel."
          }]);
        }
      } catch (e) {
        setChatHistory(prev => [...prev, { role: "assistant", content: "❌ Error generating document. Please try again." }]);
        toast.error("Generation failed");
      }
    } finally {
      setLoading(false);
      setPrompt("");
    }
  };

  const downloadDocument = async (format = "pdf") => {
    if (!documentContent && generatedFiles.length === 0) {
      toast.error("No document to download");
      return;
    }
    
    // If we have a generated file URL, use it
    if (generatedFiles.length > 0 && generatedFiles[0].url) {
      window.open(`${BACKEND_URL}${generatedFiles[0].url}`, '_blank');
      toast.success("Download started!");
      return;
    }
    
    // Otherwise, generate and download
    try {
      const res = await api.post("/document/download", {
        content: documentContent,
        document_type: documentType,
        document_name: documentName || "Document",
        format: format
      }, { responseType: 'blob' });
      
      const blob = new Blob([res.data], { 
        type: format === 'pdf' ? 'application/pdf' : 
              format === 'xlsx' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' :
              format === 'docx' ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' :
              'text/plain'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentName || 'Document'}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success(`Downloaded as ${format.toUpperCase()}!`);
    } catch (error) {
      // Fallback to text download
      const blob = new Blob([documentContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${documentName || 'Document'}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Downloaded!");
    }
    setShowDownloadMenu(false);
  };

  const applyTemplate = (template) => {
    setPrompt(template.prompt);
    toast.info(`Template loaded: ${template.label}`);
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0a0a0a] via-[#0f0f1a] to-[#0a0a0a]">
      {/* Header */}
      <div className="h-14 border-b border-white/10 flex items-center justify-between px-4 bg-[#0d0d0d]/80 backdrop-blur-xl">
        <div className="flex items-center gap-4">
          <Button size="sm" variant="ghost" onClick={onBack} className="h-8">
            <X className="w-4 h-4 mr-1" /> Back
          </Button>
          <div className="h-6 w-px bg-white/20" />
          <h2 className="font-secondary text-base font-bold flex items-center gap-2">
            <FileCode className="w-5 h-5 text-cyan-400" /> GAAIUS AI Document Studio
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Input 
            value={documentName} 
            onChange={(e) => setDocumentName(e.target.value)}
            className="w-56 h-8 text-sm bg-white/5 border-white/10"
            placeholder="Auto-named from your request..."
          />
        </div>
      </div>
      
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Document Types & Templates */}
        <div className="w-72 border-r border-white/10 flex flex-col bg-[#0d0d0d]">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full grid grid-cols-3 m-2 bg-white/5">
              <TabsTrigger value="create" className="text-xs">Types</TabsTrigger>
              <TabsTrigger value="templates" className="text-xs">Templates</TabsTrigger>
              <TabsTrigger value="history" className="text-xs">Files</TabsTrigger>
            </TabsList>
            
            <TabsContent value="create" className="flex-1 p-3 space-y-2 overflow-auto">
              <p className="text-xs text-muted-foreground uppercase font-mono mb-2">Document Type</p>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {documentTypes.map(dt => (
                  <button
                    key={dt.id}
                    onClick={() => setDocumentType(dt.id)}
                    className={`w-full flex items-center gap-2 p-2.5 rounded-lg text-sm transition mb-1 ${documentType === dt.id ? "bg-cyan-500/20 border border-cyan-500/40" : "hover:bg-white/5"}`}
                  >
                    <span className="text-lg">{dt.icon}</span>
                    <div className="text-left">
                      <span className="block">{dt.label}</span>
                      <span className="text-xs text-muted-foreground">{dt.description}</span>
                    </div>
                  </button>
                ))}
              </ScrollArea>
              
              {documentType === "invoice" && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-xs text-muted-foreground uppercase font-mono mb-2">Invoice Type</p>
                  <Select value={invoiceType} onValueChange={setInvoiceType}>
                    <SelectTrigger className="w-full bg-white/5 border-white/10 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {invoiceTypes.map(it => (
                        <SelectItem key={it.id} value={it.id}>
                          <div>
                            <span>{it.label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    {invoiceTypes.find(t => t.id === invoiceType)?.description}
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="templates" className="flex-1 p-3 overflow-auto">
              <p className="text-xs text-muted-foreground uppercase font-mono mb-2">Quick Templates</p>
              <ScrollArea className="h-[calc(100vh-200px)]">
                {(quickTemplates[documentType] || quickTemplates.invoice).map((template, i) => (
                  <button
                    key={i}
                    onClick={() => applyTemplate(template)}
                    className="w-full text-left p-3 rounded-lg hover:bg-white/5 border border-white/5 mb-2 transition"
                  >
                    <p className="text-sm font-medium text-cyan-400">{template.label}</p>
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{template.prompt.slice(0, 80)}...</p>
                  </button>
                ))}
              </ScrollArea>
            </TabsContent>
            
            <TabsContent value="history" className="flex-1 p-3 overflow-auto">
              <p className="text-xs text-muted-foreground uppercase font-mono mb-2">Generated Files</p>
              {generatedFiles.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No files yet</p>
              ) : (
                <div className="space-y-2">
                  {generatedFiles.map((file, i) => (
                    <div key={i} className="glass-light rounded-lg p-3 text-xs">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-muted-foreground">{new Date(file.timestamp).toLocaleTimeString()}</p>
                      <Button size="sm" variant="ghost" onClick={() => downloadDocument(file)} className="w-full mt-2 h-7 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400">
                        <Download className="w-3 h-3 mr-1" /> Download
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Middle - AI Chat */}
        <div className="w-96 border-r border-white/10 flex flex-col bg-[#0a0a0a]">
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-cyan-400" />
              <span className="font-semibold">AI Document Assistant</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Creating: <span className="text-cyan-400">{documentTypes.find(d => d.id === documentType)?.label}</span>
              {documentType === "invoice" && <span className="text-muted-foreground"> ({invoiceTypes.find(t => t.id === invoiceType)?.label})</span>}
            </p>
          </div>
          
          <ScrollArea className="flex-1 p-4">
            {chatHistory.length === 0 ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 flex items-center justify-center mx-auto mb-4">
                  <FileCode className="w-8 h-8 text-cyan-400" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">Describe your {documentTypes.find(d => d.id === documentType)?.label.toLowerCase()}</p>
                <div className="space-y-2 text-xs text-left">
                  {documentType === "invoice" ? (
                    <>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a professional invoice for web development services. Client: ABC Company, Project: Website Redesign, Amount: $5,000, Payment terms: Net 30")}>
                        💡 Web development invoice - $5,000
                      </p>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a freelance design invoice. Client: XYZ Marketing, Services: Logo design, Brand guidelines, Social media kit. Total: $1,200, Due in 15 days")}>
                        💡 Freelance design invoice - $1,200
                      </p>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a consulting services invoice with hourly rate. Client: StartupCo, Rate: $150/hr, Hours: 25, Total: $3,750. Include strategy sessions and market analysis")}>
                        💡 Consulting hourly invoice - $3,750
                      </p>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt("Create a recurring monthly SaaS subscription invoice. Client: Enterprise Ltd, Plan: Professional ($299), Addons: Priority support ($50), Storage ($25), Total: $374/month")}>
                        💡 SaaS subscription invoice - $374/mo
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt(`Create a professional ${documentTypes.find(d => d.id === documentType)?.label.toLowerCase()} for a technology company`)}>
                        💡 "{documentTypes.find(d => d.id === documentType)?.label} for tech company"
                      </p>
                      <p className="text-cyan-400/80 cursor-pointer hover:text-cyan-400 p-2 rounded hover:bg-white/5" onClick={() => setPrompt(`Create a detailed ${documentTypes.find(d => d.id === documentType)?.label.toLowerCase()} with professional formatting`)}>
                        💡 "Detailed professional {documentTypes.find(d => d.id === documentType)?.label.toLowerCase()}"
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {chatHistory.map((msg, i) => (
                  <div key={i} className={`p-3 rounded-xl text-sm ${msg.role === "user" ? "bg-cyan-500/20 ml-4 border border-cyan-500/20" : "bg-white/5 mr-4"}`}>
                    <p className="text-xs text-muted-foreground mb-1">{msg.role === "user" ? "You" : "GAAIUS AI"}</p>
                    {msg.content}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
          
          <div className="p-4 border-t border-white/10">
            <div className="flex gap-2">
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe your ${documentType}...`}
                className="flex-1 bg-white/5 border-white/10"
                onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
              />
              <Button onClick={handleGenerate} disabled={loading} className="bg-cyan-600 hover:bg-cyan-700">
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Right - Document Preview */}
        <div className="flex-1 flex flex-col bg-[#111]">
          <div className="h-10 border-b border-white/10 flex items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-mono">Document Preview</span>
              {documentContent && (
                <Button 
                  size="sm" 
                  variant="ghost" 
                  onClick={() => setIsEditing(!isEditing)} 
                  className={`h-6 text-xs ml-2 ${isEditing ? 'bg-cyan-500/20 text-cyan-400' : ''}`}
                >
                  <Edit className="w-3 h-3 mr-1" /> {isEditing ? "Preview" : "Edit"}
                </Button>
              )}
            </div>
            {documentContent && (
              <div className="flex items-center gap-2 relative">
                <Button 
                  size="sm" 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="h-7 text-xs bg-cyan-600 hover:bg-cyan-700"
                >
                  <Download className="w-3 h-3 mr-1" /> DOWNLOAD
                </Button>
                {showDownloadMenu && (
                  <div className="absolute top-full right-0 mt-1 bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-50 min-w-[150px]">
                    <button onClick={() => downloadDocument("pdf")} className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 flex items-center gap-2">
                      📄 PDF (Default)
                    </button>
                    <button onClick={() => downloadDocument("docx")} className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 flex items-center gap-2">
                      📝 Word (.docx)
                    </button>
                    {(documentType === "xlsx" || documentContent.includes(',')) && (
                      <button onClick={() => downloadDocument("xlsx")} className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 flex items-center gap-2">
                        📊 Excel (.xlsx)
                      </button>
                    )}
                    <button onClick={() => downloadDocument("txt")} className="w-full px-3 py-2 text-left text-xs hover:bg-white/5 flex items-center gap-2">
                      📃 Text (.txt)
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 overflow-auto bg-white">
            {documentContent ? (
              isEditing ? (
                <textarea
                  value={documentContent}
                  onChange={(e) => setDocumentContent(e.target.value)}
                  className="w-full h-full p-6 text-black text-sm font-mono resize-none focus:outline-none"
                  placeholder="Edit your document here..."
                />
              ) : (
                <div className="max-w-3xl mx-auto p-8 text-black">
                  {/* Render as formatted document based on type */}
                  {(documentType === "invoice" || documentType === "quotation" || documentType === "receipt") ? (
                    <div className="border border-gray-200 rounded-lg shadow-sm">
                      <div className="bg-gray-50 p-6 border-b">
                        <h1 className="text-2xl font-bold text-gray-800">{documentType.toUpperCase()}</h1>
                        <p className="text-sm text-gray-500">{documentName || "Document"}</p>
                      </div>
                      <div className="p-6 whitespace-pre-wrap text-sm leading-relaxed">
                        {documentContent}
                      </div>
                    </div>
                  ) : (
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-gray-800">{documentContent}</pre>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <FileCode className="w-16 h-16 mb-4 opacity-30" />
                <p className="text-lg">Your document will appear here</p>
                <p className="text-sm">Tell the AI what to create using the chat</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Main App Component
const MainApp = () => {
  // Persist mode in localStorage
  const [mode, setMode] = useState(() => {
    const savedMode = localStorage.getItem("gaaius_mode");
    return savedMode || "chat";
  });
  const [sessions, setSessions] = useState([]);
  const [currentSession, setCurrentSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [generations, setGenerations] = useState([]);
  const [videoStyle, setVideoStyle] = useState("cinematic");
  const [fileType, setFileType] = useState("code");
  const [showAuth, setShowAuth] = useState(false);
  const [showPro, setShowPro] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  
  const { user, token, logout } = useAuthStore();
  const messagesEndRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Save mode to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("gaaius_mode", mode);
  }, [mode]);

  // Handle mode change with navigation
  const handleModeChange = (newMode) => {
    setMode(newMode);
    // If on projects/build page, navigate to main page
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  // Check auth on mount
  useEffect(() => {
    if (token) {
      api.get("/auth/me").then(res => useAuthStore.getState().setUser(res.data)).catch(() => useAuthStore.getState().logout());
    }
  }, [token]);

  useEffect(() => { fetchSessions(); fetchGenerations(); }, []);
  useEffect(() => { if (currentSession) fetchMessages(currentSession.id); }, [currentSession]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const fetchSessions = async () => {
    try {
      const res = await api.get("/sessions");
      setSessions(res.data);
      if (res.data.length > 0 && !currentSession) setCurrentSession(res.data[0]);
    } catch (error) {}
  };

  const fetchMessages = async (sessionId) => {
    try {
      const res = await api.get(`/chat/${sessionId}/history`);
      setMessages(res.data);
    } catch (error) {}
  };

  const fetchGenerations = async () => {
    try {
      const res = await api.get("/generations");
      setGenerations(res.data);
    } catch (error) {}
  };

  const createSession = async () => {
    try {
      const res = await api.post("/sessions?name=New Chat");
      setSessions(prev => [res.data, ...prev]);
      setCurrentSession(res.data);
      setMessages([]);
      toast.success("New chat created");
    } catch (error) {
      toast.error("Failed to create session");
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      await api.delete(`/sessions/${sessionId}`);
      setSessions(prev => prev.filter(s => s.id !== sessionId));
      if (currentSession?.id === sessionId) {
        const remaining = sessions.filter(s => s.id !== sessionId);
        setCurrentSession(remaining[0] || null);
      }
      toast.success("Chat deleted");
    } catch (error) {
      toast.error("Failed to delete session");
    }
  };

  // Check for projects/build routes
  if (location.pathname === "/projects") {
    return (
      <>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
        <div className="h-screen flex bg-[#050505] overflow-hidden">
          <Toaster position="top-center" theme="dark" />
          <Sidebar 
            mode={mode} setMode={handleModeChange} sessions={sessions} currentSession={currentSession}
            setCurrentSession={setCurrentSession} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}
            createSession={createSession} deleteSession={deleteSession} navigate={navigate}
            user={user} showAuth={() => setShowAuth(true)} showPro={() => setShowPro(true)} 
            showProfile={() => setShowProfile(true)} logout={logout}
          />
          {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}
          <main className="flex-1 flex flex-col min-w-0">
            <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 glass">
              <div className="flex items-center gap-4">
                <button className="md:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setSidebarOpen(true)}><Menu className="w-5 h-5" /></button>
                <span className="font-secondary text-sm font-semibold">Projects</span>
              </div>
            </header>
            <div className="flex-1 overflow-auto"><ProjectsPage /></div>
          </main>
        </div>
      </>
    );
  }

  if (location.pathname === "/build") {
    return (
      <>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
        <div className="h-screen bg-[#050505]">
          <Toaster position="top-center" theme="dark" />
          <BuildPage navigate={navigate} user={user} showAuth={() => setShowAuth(true)} showPro={() => setShowPro(true)} showProfile={() => setShowProfile(true)} logout={logout} />
        </div>
      </>
    );
  }

  if (location.pathname === "/documents") {
    return (
      <>
        <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
        <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
        <div className="h-screen bg-[#050505]">
          <Toaster position="top-center" theme="dark" />
          <DocumentStudio onBack={() => navigate("/")} />
        </div>
      </>
    );
  }

  // Auto-name session based on first message
  const autoNameSession = async (sessionId, message) => {
    const name = message.slice(0, 30) + (message.length > 30 ? "..." : "");
    try {
      await api.put(`/sessions/${sessionId}`, { name });
      setSessions(prev => prev.map(s => s.id === sessionId ? { ...s, name } : s));
    } catch (error) {}
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    const userInput = input.trim();
    setInput("");
    setLoading(true);

    try {
      if (mode === "chat") {
        let sessionId = currentSession?.id;
        let isNewSession = false;
        if (!sessionId) {
          const res = await api.post("/sessions?name=New Chat");
          sessionId = res.data.id;
          setCurrentSession(res.data);
          setSessions(prev => [res.data, ...prev]);
          isNewSession = true;
        }
        const tempUserMsg = { id: `temp-${Date.now()}`, role: "user", content: userInput, timestamp: new Date().toISOString() };
        setMessages(prev => [...prev, tempUserMsg]);
        
        // Auto-name session on first message
        if (isNewSession || (messages.length === 0)) {
          autoNameSession(sessionId, userInput);
        }
        
        const res = await api.post("/chat", { session_id: sessionId, message: userInput });
        setMessages(prev => {
          const filtered = prev.filter(m => m.id !== tempUserMsg.id);
          return [...filtered, { ...tempUserMsg, id: `user-${Date.now()}` }, { id: res.data.id, role: "assistant", content: res.data.content, timestamp: res.data.timestamp }];
        });
      } else if (mode === "image") {
        const toastId = toast.loading("Generating image... You can continue using other features");
        // Run image generation in background (non-blocking)
        api.post("/image/generate", { prompt: userInput, session_id: currentSession?.id }, { timeout: 300000 })
          .then(res => {
            const newGen = { ...res.data, type: "image", url: res.data.image_url || res.data.url };
            setGenerations(prev => [newGen, ...prev]);
            toast.dismiss(toastId);
            toast.success("Image generated!");
          })
          .catch(() => {
            toast.dismiss(toastId);
            toast.error("Image generation failed");
          });
        setLoading(false);
        return; // Don't wait
      } else if (mode === "video") {
        const toastId = toast.loading("Generating video... You can continue using other features");
        // Run video generation in background (non-blocking)
        api.post("/video/generate", { prompt: userInput, duration: 5, style: videoStyle, session_id: currentSession?.id }, { timeout: 600000 })
          .then(res => {
            const newGen = { ...res.data, type: "video", url: res.data.video_url || res.data.url };
            setGenerations(prev => [newGen, ...prev]);
            toast.dismiss(toastId);
            toast.success("Video generated!");
          })
          .catch(() => {
            toast.dismiss(toastId);
            toast.error("Video generation failed");
          });
        setLoading(false);
        return; // Don't wait
      } else if (mode === "audio") {
        const toastId = toast.loading("Generating audio...");
        // Run audio generation in background (non-blocking)
        api.post("/audio/generate", { prompt: userInput, duration: 10, type: "music" })
          .then(res => {
            const newGen = { ...res.data, type: "audio", url: res.data.audio_url || res.data.url };
            setGenerations(prev => [newGen, ...prev]);
            toast.dismiss(toastId);
            toast.success("Audio generated!");
          })
          .catch(() => {
            toast.dismiss(toastId);
            toast.error("Audio generation failed");
          });
        setLoading(false);
        return; // Don't wait
      } else if (mode === "file") {
        const toastId = toast.loading("Generating file...");
        const res = await api.post("/file/generate", { prompt: userInput, file_type: fileType });
        const newGen = { ...res.data, type: "file", url: res.data.file_url || res.data.url };
        setGenerations(prev => [newGen, ...prev]);
        toast.dismiss(toastId);
        toast.success("File generated!");
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = async (text) => {
    try {
      toast.info("Generating speech...");
      const res = await api.post("/tts", { text, voice: "en" }, { responseType: 'blob' });
      const audioUrl = URL.createObjectURL(res.data);
      new Audio(audioUrl).play();
    } catch (error) {
      toast.error("TTS failed");
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      setIsRecording(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];
        mediaRecorder.ondataavailable = (e) => audioChunksRef.current.push(e.data);
        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          stream.getTracks().forEach(track => track.stop());
          toast.info("Transcribing...");
          const formData = new FormData();
          formData.append('audio', audioBlob, 'recording.webm');
          try {
            const res = await api.post("/stt", formData, { headers: { 'Content-Type': 'multipart/form-data' } });
            setInput(res.data.text);
            inputRef.current?.focus();
          } catch (error) {
            toast.error("Transcription failed");
          }
        };
        mediaRecorder.start();
        setIsRecording(true);
      } catch (error) {
        toast.error("Microphone access denied");
      }
    }
  };

  const ModeConfig = MODES[mode];

  return (
    <>
      <AuthModal open={showAuth} onClose={() => setShowAuth(false)} />
      <ProfileModal open={showProfile} onClose={() => setShowProfile(false)} />
      <ProModal open={showPro} onClose={() => setShowPro(false)} />
      
      <div className="h-screen flex bg-[#050505] overflow-hidden">
        <Toaster position="top-center" theme="dark" />
        
        <Sidebar 
          mode={mode} setMode={setMode} sessions={sessions} currentSession={currentSession}
          setCurrentSession={setCurrentSession} setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen}
          createSession={createSession} deleteSession={deleteSession} navigate={navigate}
          user={user} showAuth={() => setShowAuth(true)} showPro={() => setShowPro(true)} 
          showProfile={() => setShowProfile(true)} logout={logout}
        />

        {/* Mobile overlay */}
        {sidebarOpen && <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setSidebarOpen(false)} />}

        {/* Main */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-16 border-b border-white/10 flex items-center justify-between px-4 md:px-6 glass">
            <div className="flex items-center gap-4">
              <button className="md:hidden p-2 hover:bg-white/5 rounded-lg" onClick={() => setSidebarOpen(true)} data-testid="menu-btn">
                <Menu className="w-5 h-5" />
              </button>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${mode === "chat" ? "bg-purple-400" : mode === "image" ? "bg-cyan-400" : mode === "video" ? "bg-orange-400" : mode === "audio" ? "bg-green-400" : "bg-pink-400"} animate-pulse`} />
                <span className="font-secondary text-sm font-semibold uppercase">{MODES[mode].label} Mode</span>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {mode === "video" && (
                <Select value={videoStyle} onValueChange={setVideoStyle}>
                  <SelectTrigger className="w-28 h-8 bg-white/5 border-white/10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cinematic">Cinematic</SelectItem>
                    <SelectItem value="anime">Anime</SelectItem>
                    <SelectItem value="realistic">Realistic</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {mode === "file" && (
                <Select value={fileType} onValueChange={setFileType}>
                  <SelectTrigger className="w-28 h-8 bg-white/5 border-white/10 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="code">Code</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="data">JSON/CSV</SelectItem>
                    <SelectItem value="config">Config</SelectItem>
                  </SelectContent>
                </Select>
              )}
              
              {/* New Chat button at top right */}
              {mode === "chat" && (
                <Button size="sm" onClick={createSession} variant="outline" className="h-8 text-xs">
                  <Plus className="w-4 h-4 mr-1" /> New Chat
                </Button>
              )}
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col">
            {mode === "chat" ? (
              <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto p-4 md:p-6 pb-8">
                  {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center py-20">
                      <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center mb-6">
                        <Sparkles className="w-10 h-10 text-primary" />
                      </div>
                      <h2 className="font-secondary text-2xl font-bold mb-2">Welcome to GAAIUS</h2>
                      <p className="text-muted-foreground max-w-md">Your unified AI assistant. Chat, images, videos, audio, and files.</p>
                    </div>
                  ) : (
                    messages.map(msg => <ChatMessage key={msg.id} message={msg} onSpeak={handleSpeak} />)
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>
            ) : (
              <ScrollArea className="flex-1">
                <div className="max-w-6xl mx-auto p-4 md:p-6 pb-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {generations.filter(g => g.type === mode || (mode === "file" && g.type === "file")).map(gen => (
                      <GenerationResult key={gen.id} data={gen} type={gen.type} />
                    ))}
                    {generations.filter(g => g.type === mode || (mode === "file" && g.type === "file")).length === 0 && (
                      <div className="col-span-full text-center py-20">
                        <div className={`w-20 h-20 rounded-2xl ${ModeConfig.bgColor} flex items-center justify-center mb-6 mx-auto`}>
                          <ModeConfig.icon className={`w-10 h-10 ${ModeConfig.color}`} />
                        </div>
                        <h2 className="font-secondary text-xl font-bold mb-2">No {mode}s yet</h2>
                        <p className="text-muted-foreground">Enter a prompt to generate</p>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollArea>
            )}

            {/* Ad Banner - Only for logged-out users */}
            {!user && <AdBanner onUpgrade={() => setShowAuth(true)} />}

            {/* Input - Fixed at bottom with proper spacing */}
            <div className="p-4 glass">
              <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                <div className={`rounded-2xl p-2 flex items-center gap-2 ${ModeConfig.borderColor} border bg-black/40`}>
                  <button type="button" onClick={toggleRecording} className={`p-3 rounded-xl transition-all ${isRecording ? "bg-red-500/20 text-red-400" : "hover:bg-white/5 text-muted-foreground"}`} data-testid="voice-btn">
                    {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </button>
                  <input ref={inputRef} type="text" value={input} onChange={(e) => setInput(e.target.value)}
                    placeholder={mode === "chat" ? "Message GAAIUS..." : mode === "image" ? "Describe the image..." : mode === "video" ? "Describe the video..." : mode === "audio" ? "Describe music/sound..." : "Describe the file to generate..."}
                    className="flex-1 bg-transparent border-none outline-none text-base py-2 px-2" disabled={loading} data-testid="chat-input" />
                  <Button type="submit" disabled={loading || !input.trim()} className={`rounded-xl px-4 ${ModeConfig.bgColor}`} data-testid="send-btn">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

// Sidebar Component
const Sidebar = ({ mode, setMode, sessions, currentSession, setCurrentSession, setSidebarOpen, sidebarOpen, createSession, deleteSession, navigate, user, showAuth, showPro, showProfile, logout }) => {
  return (
    <aside className={`fixed md:relative z-50 h-full w-72 glass border-r border-white/10 flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`} data-testid="sidebar">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-secondary text-xl font-bold">GAAIUS</h1>
              <p className="font-mono text-xs text-muted-foreground uppercase">AI</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mode Selector */}
      <div className="p-4 border-b border-white/10">
        <p className="font-mono text-xs text-muted-foreground uppercase mb-3">Mode</p>
        <div className="grid grid-cols-5 gap-1">
          {Object.entries(MODES).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <button key={key} onClick={() => setMode(key)} className={`p-2 rounded-lg transition-all ${mode === key ? `${config.bgColor} ${config.borderColor} border` : "hover:bg-white/5"}`} data-testid={`mode-${key}`}>
                <Icon className={`w-4 h-4 mx-auto ${mode === key ? config.color : "text-muted-foreground"}`} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-white/10">
        <p className="font-mono text-xs text-muted-foreground uppercase mb-2">Tools</p>
        <div className="space-y-1">
          <button onClick={() => navigate("/projects")} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left">
            <FolderOpen className="w-4 h-4 text-muted-foreground" /><span className="text-sm">Projects</span>
          </button>
          <button onClick={() => navigate("/build")} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left">
            <Hammer className="w-4 h-4 text-orange-400" /><span className="text-sm">AI Builder</span>
          </button>
          <button onClick={() => navigate("/documents")} className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 text-left">
            <FileCode className="w-4 h-4 text-cyan-400" /><span className="text-sm">AI Document Studio</span>
          </button>
        </div>
      </div>

      {/* Sessions */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <div className="p-4 flex items-center justify-between">
          <p className="font-mono text-xs text-muted-foreground uppercase">Chats</p>
          <Button size="sm" variant="ghost" onClick={createSession} className="h-6 w-6 p-0" data-testid="new-chat-btn">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <ScrollArea className="flex-1 px-4">
          {sessions.map(session => (
            <div key={session.id} className={`group flex items-center gap-3 p-3 rounded-xl mb-2 cursor-pointer transition-all ${currentSession?.id === session.id ? "bg-primary/20 border border-primary/30" : "hover:bg-white/5"}`}
              onClick={() => { 
                setCurrentSession(session); 
                setSidebarOpen(false);
                setMode("chat");
                navigate("/");
              }} data-testid={`session-${session.id}`}>
              <MessageSquare className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <span className="flex-1 truncate text-sm">{session.name}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteSession(session.id); }} className="opacity-0 group-hover:opacity-100 p-1 hover:bg-white/10 rounded flex-shrink-0" data-testid={`delete-session-${session.id}`}>
                <Trash2 className="w-4 h-4 text-destructive" />
              </button>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* User */}
      <div className="p-4 border-t border-white/10">
        {user ? (
          <div className="glass-light rounded-xl p-3">
            <div 
              className="flex items-center gap-3 cursor-pointer hover:opacity-80"
              onClick={showProfile}
            >
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user.name || user.email}</p>
                {user.is_pro && <span className="text-xs text-yellow-400 flex items-center gap-1"><Crown className="w-3 h-3" /> Pro</span>}
              </div>
            </div>
            {!user.is_pro && (
              <Button size="sm" onClick={showPro} className="w-full mt-2 bg-yellow-500 hover:bg-yellow-600 text-black text-xs">
                <Crown className="w-3 h-3 mr-1" /> Go Pro - $1
              </Button>
            )}
          </div>
        ) : (
          <Button onClick={showAuth} className="w-full" variant="outline">
            <User className="w-4 h-4 mr-2" /> Sign In
          </Button>
        )}
      </div>
    </aside>
  );
};

// App with Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
