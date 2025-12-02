class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">مشکلی پیش آمده</h1>
            <button onClick={() => window.location.reload()} className="px-6 py-2 bg-[var(--primary-color)] text-white rounded-lg">بارگذاری مجدد</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  try {
    const [messages, setMessages] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
    const chatContainerRef = React.useRef(null);

    React.useEffect(() => {
      if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
      }
    }, [messages]);

    const handleSendMessage = async (text) => {
      const userMessage = { role: 'user', content: text };
      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await askAI(text, messages);
        const aiMessage = { role: 'assistant', content: response };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        const errorMessage = { 
          role: 'assistant', 
          content: error.message || 'متأسفم، در پردازش درخواست شما مشکلی پیش آمد. لطفاً دوباره تلاش کنید.' 
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)]" data-name="app" data-file="app.js">
        <Header />
        {messages.length === 0 ? (
          <Hero />
        ) : (
          <div className="container max-w-4xl mx-auto px-4 py-8">
            {messages.length > 0 && (
              <button 
                onClick={() => setMessages([])} 
                className="mb-6 px-5 py-3 bg-white rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2 border border-[var(--border-color)] hover:border-[var(--primary-color)] hover:-translate-y-0.5"
              >
                <div className="icon-home text-lg text-[var(--primary-color)]"></div>
                <span className="text-sm font-medium">بازگشت به صفحه اصلی</span>
              </button>
            )}
            <div ref={chatContainerRef} className="space-y-4 mb-24 max-h-[calc(100vh-250px)] overflow-y-auto">
              {messages.map((message, index) => (
                <ChatMessage key={index} message={message} />
              ))}
              {isLoading && (
                <div className="flex items-center gap-3 px-5 py-4 bg-white border border-[var(--border-color)] rounded-2xl shadow-sm w-fit">
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)] rounded-full animate-bounce"></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--secondary-color)] to-[var(--accent-color)] rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                  <div className="w-3 h-3 bg-gradient-to-r from-[var(--accent-color)] to-[var(--primary-color)] rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                  <span className="text-sm text-[var(--text-secondary)] font-medium">در حال فکر کردن...</span>
                </div>
              )}
            </div>
          </div>
        )}
        <ChatInput onSend={handleSendMessage} disabled={isLoading} />
      </div>
    );
  } catch (error) {
    console.error('App component error:', error);
    return null;
  }
}

function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[var(--bg-gradient-start)] to-[var(--bg-gradient-end)] border-t border-[var(--border-color)] py-8 mt-12">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm">
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="icon-phone text-lg text-[var(--primary-color)]"></div>
            <span className="font-medium text-[var(--text-primary)]">09197074940</span>
          </div>
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm">
            <div className="icon-map-pin text-lg text-[var(--secondary-color)]"></div>
            <span className="font-medium text-[var(--text-primary)]">مازندران، لاویج، رییس کلا</span>
          </div>
          <p className="text-center text-[var(--text-secondary)] font-medium">© 2025 ای کیو. تمامی حقوق محفوظ است.</p>
        </div>
      </div>
    </footer>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ErrorBoundary>
    <App />
    <Footer />
  </ErrorBoundary>
);
