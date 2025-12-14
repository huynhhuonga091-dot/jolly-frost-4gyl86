import React, { useState, useEffect, useRef } from "react";
import {
  FileText,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  MessageSquare,
  Send,
  BarChart2,
  User,
  ArrowRight,
  RefreshCw,
  Star,
  Target,
  Award,
  ChevronRight,
  Upload,
  X,
  Image as ImageIcon,
  Lightbulb,
  Clock,
  Smile,
  Mail,
  BookOpen,
  ThumbsUp,
  Unlock,
} from "lucide-react";

// --- RICH DATA & SCENARIOS (NEW INTERVIEW FEATURE) ---

const INTERVIEW_DATA = [
  {
    id: 1,
    question:
      "Hãy giới thiệu ngắn gọn về bản thân và kinh nghiệm làm việc của bạn.",
    purpose: "Đánh giá khả năng tổng hợp và sự phù hợp cơ bản.",
    hint: "Dùng công thức: Quá khứ (Học vấn) -> Hiện tại (Kinh nghiệm nổi bật) -> Tương lai (Tại sao chọn công ty này). Đừng kể lể đời tư.",
    modelAnswer:
      "Em tốt nghiệp chuyên ngành Marketing tại ĐH Kinh Tế. Em đã có 2 năm kinh nghiệm làm Content SEO tại công ty ABC, nơi em đã giúp tăng traffic website lên 30% trong 6 tháng. Hiện tại, em muốn thử sức ở môi trường agency năng động như công ty mình để phát triển kỹ năng quản lý dự án.",
    keyPoints: [
      "Ngắn gọn (dưới 2 phút)",
      "Nêu được thành tích số hóa",
      "Thể hiện định hướng rõ ràng",
    ],
  },
  {
    id: 2,
    question: "Tại sao bạn lại nghỉ việc ở công ty cũ?",
    purpose:
      "Kiểm tra thái độ và sự trung thực, tránh ứng viên hay nói xấu công ty cũ.",
    hint: "Tuyệt đối không nói xấu sếp hay công ty cũ. Tập trung vào 'hướng tới tương lai' và 'phát triển bản thân'.",
    modelAnswer:
      "Em rất trân trọng khoảng thời gian tại công ty cũ vì đã học được nhiều điều. Tuy nhiên, em cảm thấy mình đã đạt đến ngưỡng học hỏi ở vị trí đó và muốn tìm kiếm một môi trường có nhiều thách thức hơn về mặt [Kỹ năng chuyên môn trong JD] để phát triển sự nghiệp lâu dài.",
    keyPoints: ["Tích cực", "Không phàn nàn", "Lý do hướng tới sự phát triển"],
  },
  {
    id: 3,
    question: "Điểm yếu lớn nhất của bạn là gì?",
    purpose: "Đánh giá sự tự nhận thức và khả năng tự hoàn thiện.",
    hint: "Đừng nói 'Em quá cầu toàn' (sáo rỗng) hoặc điểm yếu chết người (ví dụ: lười biếng). Hãy chọn một điểm yếu thật nhưng không ảnh hưởng cốt lõi đến công việc, và nêu cách bạn đang khắc phục.",
    modelAnswer:
      "Trước đây em thường gặp khó khăn khi nói trước đám đông. Để khắc phục, em đã tham gia câu lạc bộ thuyết trình và chủ động nhận báo cáo nhóm hàng tuần. Hiện tại em đã tự tin hơn 70% và vẫn đang tiếp tục rèn luyện.",
    keyPoints: [
      "Thành thật",
      "Chọn điểm yếu có thể khắc phục",
      "Luôn kèm theo giải pháp khắc phục (Action Plan)",
    ],
  },
  {
    id: 4,
    question: "Tại sao bạn nghĩ mình phù hợp với vị trí này?",
    purpose: "Đây là câu hỏi 'chốt sale'. Hãy bán bản thân dựa trên JD.",
    hint: "So khớp: 'JD cần A, em có A'. Dùng các từ khóa trong mô tả công việc.",
    modelAnswer:
      "Qua tìm hiểu JD, em thấy công ty đang cần một người mạnh về [Kỹ năng A]. Trong dự án gần nhất, em đã dùng [Kỹ năng A] để giải quyết vấn đề [Vấn đề] mang lại kết quả [Kết quả]. Ngoài ra, em cũng rất thích văn hóa [Văn hóa công ty] của quý công ty.",
    keyPoints: [
      "Dẫn chứng từ JD",
      "Có ví dụ minh họa",
      "Thể hiện sự tìm hiểu về công ty",
    ],
  },
  {
    id: 5,
    question: "Bạn mong muốn mức lương bao nhiêu?",
    purpose: "Đàm phán và xem xét ngân sách.",
    hint: "Đừng đưa ra một con số cứng nhắc quá sớm. Hãy đưa ra một khoảng (range) hoặc hỏi ngược lại về ngân sách.",
    modelAnswer:
      "Dựa trên năng lực của bản thân và khảo sát thị trường cho vị trí này, em mong muốn mức thu nhập trong khoảng 15 - 18 triệu Gross. Tuy nhiên, em quan trọng hơn là cơ hội phát triển và gói phúc lợi tổng thể của công ty ạ.",
    keyPoints: [
      "Đưa ra khoảng lương (Range)",
      "Tự tin nhưng linh hoạt",
      "Nhắc đến giá trị mang lại",
    ],
  },
];

// --- Components ---

const Button = ({
  children,
  onClick,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyle =
    "px-4 py-2 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2";
  const variants = {
    primary:
      "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/30",
    secondary: "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50",
    outline: "border-2 border-blue-600 text-blue-600 hover:bg-blue-50",
    ghost: "text-gray-600 hover:bg-gray-100",
    success:
      "bg-green-600 text-white hover:bg-green-700 shadow-lg shadow-green-500/30",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variants[variant]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${className}`}
  >
    {children}
  </div>
);

const ProgressBar = ({ value, color = "bg-blue-600" }) => (
  <div className="w-full bg-gray-200 rounded-full h-2.5">
    <div
      className={`${color} h-2.5 rounded-full transition-all duration-1000`}
      style={{ width: `${value}%` }}
    ></div>
  </div>
);

// --- Main Application ---

export default function App() {
  const [activeTab, setActiveTab] = useState("input");
  const [cvText, setCvText] = useState("");
  const [jdText, setJdText] = useState("");

  // File Upload State
  const [cvFile, setCvFile] = useState(null);
  const [jdFile, setJdFile] = useState(null);
  const [cvPreview, setCvPreview] = useState(null);
  const [jdPreview, setJdPreview] = useState(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const cvFileInputRef = useRef(null);
  const jdFileInputRef = useRef(null);

  // Analysis State
  const [analysisResult, setAnalysisResult] = useState(null);
  const [matchResult, setMatchResult] = useState(null);

  // Interview State
  const [messages, setMessages] = useState([]);
  const [currentInput, setCurrentInput] = useState("");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // --- Logic ---

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    if (type === "cv") {
      setCvFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setCvPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setCvPreview(null);
      }
    } else {
      setJdFile(file);
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => setJdPreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setJdPreview(null);
      }
    }
  };

  const clearFile = (type) => {
    if (type === "cv") {
      setCvFile(null);
      setCvPreview(null);
      if (cvFileInputRef.current) cvFileInputRef.current.value = "";
    } else {
      setJdFile(null);
      setJdPreview(null);
      if (jdFileInputRef.current) jdFileInputRef.current.value = "";
    }
  };

  const handleAnalyze = () => {
    const hasCvContent = cvText.length >= 50 || cvFile;
    if (!hasCvContent) {
      alert(
        "Vui lòng nhập nội dung CV (tối thiểu 50 ký tự) hoặc tải lên file CV để phân tích."
      );
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI processing delay with DYNAMIC Logic
    setTimeout(() => {
      const contentToAnalyze = cvFile
        ? "Mô phỏng nội dung trích xuất từ file: kinh nghiệm quản lý, đạt doanh số 150%, email: candidate@test.com, kỹ năng: React, Node.js"
        : cvText;

      const hasNumbers = /\d+/.test(contentToAnalyze);
      const hasEmail = /@/.test(contentToAnalyze);
      const hasActionVerbs =
        /đạt được|phát triển|tối ưu|xây dựng|quản lý/i.test(contentToAnalyze);

      const score =
        Math.floor(Math.random() * 20) +
        60 +
        (hasNumbers ? 10 : 0) +
        (hasActionVerbs ? 10 : 0);

      setAnalysisResult({
        score: score,
        strengths: [
          hasActionVerbs
            ? "Sử dụng tốt các động từ chỉ hành động."
            : "Cấu trúc CV rõ ràng, dễ đọc.",
          hasEmail
            ? "Thông tin liên hệ đầy đủ."
            : "Có liệt kê các kỹ năng cơ bản.",
          "Trình bày kinh nghiệm theo trình tự thời gian hợp lý.",
        ],
        weaknesses: [
          !hasNumbers
            ? "Thiếu các con số định lượng (KPIs, % tăng trưởng)."
            : "Một số câu văn còn khá dài dòng.",
          "Chưa làm nổi bật đủ các từ khóa chuyên ngành (SEO keywords).",
          "Phần mục tiêu nghề nghiệp còn hơi chung chung.",
        ],
        suggestions: [
          "Hãy áp dụng mô hình STAR (Situation, Task, Action, Result) cho phần kinh nghiệm.",
          !hasNumbers
            ? "Thêm các con số cụ thể. Ví dụ: 'Tăng doanh thu 20%' thay vì 'Tăng doanh thu'."
            : "Kiểm tra lại lỗi chính tả và ngữ pháp.",
          "Tùy chỉnh CV này cho từng vị trí ứng tuyển thay vì dùng chung 1 bản.",
          "Đưa các chứng chỉ hoặc kỹ năng quan trọng lên phần đầu.",
        ],
      });

      // Mock JD Match Logic
      if (jdText || jdFile) {
        const matchScore = Math.floor(Math.random() * 30) + 50;
        setMatchResult({
          score: matchScore,
          missingSkills: [
            "Kỹ năng quản lý thời gian",
            "Tiếng Anh giao tiếp",
            "Agile/Scrum",
            "Phân tích dữ liệu",
          ],
          advice:
            "JD yêu cầu cao về khả năng làm việc nhóm và chịu áp lực. Hãy bổ sung các ví dụ chứng minh điều này vào CV của bạn.",
        });
      }

      setIsAnalyzing(false);
      setActiveTab("analyze");
    }, 2000);
  };

  const startInterview = () => {
    setInterviewStarted(true);
    setCurrentQuestionIndex(0);
    setMessages([
      {
        sender: "bot",
        type: "question",
        data: INTERVIEW_DATA[0],
      },
    ]);
  };

  const handleSendMessage = () => {
    if (!currentInput.trim()) return;

    // 1. Add User Answer
    const newMessages = [...messages, { sender: "user", text: currentInput }];
    setMessages(newMessages);
    setCurrentInput("");
    setIsTyping(true);
    setShowHint(false);

    // 2. Bot analyzes and gives feedback + next question
    setTimeout(() => {
      const currentQ = INTERVIEW_DATA[currentQuestionIndex];
      const nextIndex = currentQuestionIndex + 1;

      // Generate simulated specific feedback
      let feedback = "";
      if (currentInput.length < 50) {
        feedback =
          "Câu trả lời hơi ngắn. Bạn nên mở rộng thêm chi tiết và ví dụ cụ thể để thuyết phục hơn.";
      } else if (
        !currentInput.includes("kinh nghiệm") &&
        !currentInput.includes("học") &&
        currentQuestionIndex === 0
      ) {
        feedback =
          "Bạn chưa đề cập rõ ràng về kinh nghiệm hoặc học vấn. Hãy bổ sung nhé.";
      } else {
        feedback = "Câu trả lời khá tốt, đúng trọng tâm!";
      }

      const feedbackMsg = {
        sender: "bot",
        type: "feedback",
        data: {
          originalQuestion: currentQ,
          userAnswer: currentInput,
          feedback: feedback,
        },
      };

      const updatedMessages = [...newMessages, feedbackMsg];

      if (nextIndex < INTERVIEW_DATA.length) {
        updatedMessages.push({
          sender: "bot",
          type: "question",
          data: INTERVIEW_DATA[nextIndex],
        });
        setCurrentQuestionIndex(nextIndex);
      } else {
        updatedMessages.push({
          sender: "bot",
          type: "text",
          text: "Chúc mừng bạn đã hoàn thành buổi phỏng vấn thử! Hãy xem lại các nhận xét và câu trả lời mẫu để chuẩn bị tốt nhất nhé.",
        });
      }

      setMessages(updatedMessages);
      setIsTyping(false);
    }, 2000);
  };

  // --- Render Helpers ---

  const renderMessage = (msg, idx) => {
    if (msg.sender === "user") {
      return (
        <div key={idx} className="flex justify-end animate-fade-in">
          <div className="bg-blue-600 text-white p-3 rounded-xl rounded-br-none max-w-[85%] shadow-md">
            <p className="text-sm leading-relaxed">{msg.text}</p>
          </div>
        </div>
      );
    }

    // BOT MESSAGES
    if (msg.type === "question") {
      return (
        <div key={idx} className="flex justify-start animate-fade-in w-full">
          <div className="w-full max-w-[95%]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                <MessageSquare size={16} />
              </div>
              <span className="font-bold text-gray-700 text-sm">
                Nhà tuyển dụng AI
              </span>
            </div>

            <div className="bg-white border border-blue-100 p-5 rounded-xl shadow-sm rounded-tl-none relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">
                Câu hỏi {msg.data.id}:
              </h3>
              <p className="text-gray-700 font-medium text-lg mb-3">
                {msg.data.question}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 bg-gray-50 p-2 rounded">
                <Target size={14} className="text-blue-500" />
                <span>Mục đích: {msg.data.purpose}</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === "feedback") {
      const { originalQuestion, feedback } = msg.data;
      return (
        <div key={idx} className="flex justify-start animate-fade-in w-full">
          <div className="w-full max-w-[95%]">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                <Award size={16} />
              </div>
              <span className="font-bold text-gray-700 text-sm">
                Đánh giá & Lời khuyên
              </span>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-5 rounded-xl shadow-md space-y-4">
              {/* AI Feedback */}
              <div className="bg-white p-3 rounded-lg border border-green-100">
                <h4 className="font-bold text-green-700 text-sm mb-1 flex items-center gap-2">
                  <ThumbsUp size={14} /> Nhận xét về câu trả lời của bạn:
                </h4>
                <p className="text-sm text-gray-600 italic">"{feedback}"</p>
              </div>

              {/* Model Answer */}
              <div className="space-y-2">
                <h4 className="font-bold text-blue-800 text-sm flex items-center gap-2">
                  <Star size={16} className="text-yellow-500 fill-yellow-500" />{" "}
                  Câu trả lời mẫu (Điểm 10):
                </h4>
                <div className="bg-blue-600 text-white p-4 rounded-lg text-sm leading-relaxed relative">
                  <div className="absolute -top-2 -right-2 bg-yellow-400 text-blue-900 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                    RECOMMENDED
                  </div>
                  "{originalQuestion.modelAnswer}"
                </div>
              </div>

              {/* Key Points */}
              <div>
                <h4 className="font-bold text-gray-700 text-xs uppercase mb-2">
                  Chiến thuật ghi điểm (Checklist)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {originalQuestion.keyPoints.map((point, i) => (
                    <span
                      key={i}
                      className="text-xs bg-white border border-gray-200 px-2 py-1 rounded-md text-gray-600 flex items-center gap-1"
                    >
                      <CheckCircle size={10} className="text-green-500" />{" "}
                      {point}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (msg.type === "text") {
      return (
        <div
          key={idx}
          className="flex justify-start animate-fade-in max-w-[85%]"
        >
          <div className="bg-gray-100 text-gray-700 p-3 rounded-xl rounded-tl-none text-sm">
            {msg.text}
          </div>
        </div>
      );
    }
  };

  const renderSidebar = () => (
    <div className="w-full md:w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2 h-auto md:h-screen sticky top-0 z-10">
      <div className="flex items-center gap-2 mb-8 px-2 mt-2">
        <div className="bg-blue-600 p-2 rounded-lg">
          <FileText className="text-white w-6 h-6" />
        </div>
        <h1 className="text-xl font-bold text-gray-800">CV Coach Pro</h1>
      </div>

      <nav className="flex flex-col gap-1">
        {[
          { id: "input", icon: User, label: "Nhập Hồ Sơ" },
          { id: "analyze", icon: BarChart2, label: "Phân Tích CV" },
          { id: "match", icon: Target, label: "So Khớp JD" },
          { id: "interview", icon: MessageSquare, label: "Luyện Phỏng Vấn" },
          { id: "tips", icon: BookOpen, label: "Cẩm Nang" },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            disabled={
              (item.id === "analyze" && !analysisResult) ||
              (item.id === "match" && !matchResult)
            }
            className={`p-3 rounded-lg text-left flex items-center gap-3 transition-colors ${
              activeTab === item.id
                ? "bg-blue-50 text-blue-700 font-medium"
                : "text-gray-600 hover:bg-gray-50"
            } ${
              (item.id === "analyze" && !analysisResult) ||
              (item.id === "match" && !matchResult)
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="mt-auto p-4 bg-blue-50 rounded-xl">
        <h3 className="text-sm font-semibold text-blue-800 mb-1">Mẹo nhanh</h3>
        <p className="text-xs text-blue-600 mb-2">Luôn gửi CV dưới dạng PDF.</p>
        {/* Example Link */}
        <a
          href="#"
          className="text-xs font-bold text-blue-700 hover:underline flex items-center gap-1"
        >
          Liên hệ hỗ trợ ↗
        </a>
      </div>
    </div>
  );

  const renderInputSection = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Bắt đầu hành trình nâng cấp hồ sơ
        </h2>
        <p className="text-gray-600">
          Dán nội dung hoặc tải lên file CV và JD để AI phân tích và đưa ra
          chiến lược tối ưu nhất.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* CV Input Card */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <User size={20} className="text-blue-500" /> CV của bạn
            </h3>
            <div className="flex gap-2">
              <input
                type="file"
                ref={cvFileInputRef}
                onChange={(e) => handleFileUpload(e, "cv")}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,image/*"
              />
              {!cvFile && (
                <button
                  onClick={() => cvFileInputRef.current.click()}
                  className="text-xs flex items-center gap-1 text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-1.5 rounded transition-colors"
                >
                  <Upload size={14} /> Tải File/Ảnh
                </button>
              )}
              {cvFile && (
                <button
                  onClick={() => clearFile("cv")}
                  className="text-xs flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded transition-colors"
                >
                  <X size={14} /> Xóa
                </button>
              )}
            </div>
          </div>

          {cvFile ? (
            <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 relative group">
              {cvPreview ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded">
                  <img
                    src={cvPreview}
                    alt="CV Preview"
                    className="max-h-full max-w-full object-contain shadow-sm"
                  />
                </div>
              ) : (
                <>
                  <FileText size={48} className="text-blue-400 mb-3" />
                  <p className="font-medium text-gray-700 text-center break-all px-4">
                    {cvFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase">
                    {cvFile.name.split(".").pop()} File
                  </p>
                </>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-lg pointer-events-none" />
            </div>
          ) : (
            <textarea
              value={cvText}
              onChange={(e) => setCvText(e.target.value)}
              placeholder="Dán nội dung CV vào đây hoặc tải file lên..."
              className="w-full h-64 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
            />
          )}
        </Card>

        {/* JD Input Card */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-700 flex items-center gap-2">
              <Briefcase size={20} className="text-purple-500" /> Mô tả công
              việc (JD)
            </h3>
            <div className="flex gap-2">
              <input
                type="file"
                ref={jdFileInputRef}
                onChange={(e) => handleFileUpload(e, "jd")}
                className="hidden"
                accept=".pdf,.doc,.docx,.txt,image/*"
              />
              {!jdFile && (
                <button
                  onClick={() => jdFileInputRef.current.click()}
                  className="text-xs flex items-center gap-1 text-purple-600 bg-purple-50 hover:bg-purple-100 px-2 py-1.5 rounded transition-colors"
                >
                  <Upload size={14} /> Tải File/Ảnh
                </button>
              )}
              {jdFile && (
                <button
                  onClick={() => clearFile("jd")}
                  className="text-xs flex items-center gap-1 text-red-600 bg-red-50 hover:bg-red-100 px-2 py-1.5 rounded transition-colors"
                >
                  <X size={14} /> Xóa
                </button>
              )}
            </div>
          </div>

          {jdFile ? (
            <div className="w-full h-64 bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center p-4 relative group">
              {jdPreview ? (
                <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded">
                  <img
                    src={jdPreview}
                    alt="JD Preview"
                    className="max-h-full max-w-full object-contain shadow-sm"
                  />
                </div>
              ) : (
                <>
                  <Briefcase size={48} className="text-purple-400 mb-3" />
                  <p className="font-medium text-gray-700 text-center break-all px-4">
                    {jdFile.name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 uppercase">
                    {jdFile.name.split(".").pop()} File
                  </p>
                </>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-all rounded-lg pointer-events-none" />
            </div>
          ) : (
            <textarea
              value={jdText}
              onChange={(e) => setJdText(e.target.value)}
              placeholder="Dán nội dung JD hoặc chụp ảnh JD tải lên..."
              className="w-full h-64 p-4 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none text-sm"
            />
          )}
        </Card>
      </div>

      <div className="flex justify-end pt-4">
        <Button
          onClick={handleAnalyze}
          disabled={isAnalyzing || (!cvText && !cvFile)}
          className="w-full md:w-auto text-lg px-8 py-3"
        >
          {isAnalyzing ? (
            <>
              <RefreshCw className="animate-spin" size={20} /> Đang phân tích...
            </>
          ) : (
            <>
              Phân Tích & Đánh Giá <ArrowRight size={20} />
            </>
          )}
        </Button>
      </div>
    </div>
  );

  const renderAnalysis = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-6 items-stretch">
        {/* Score Card */}
        <Card className="p-6 md:w-1/3 flex flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-blue-800 text-white">
          <div className="relative w-32 h-32 flex items-center justify-center">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="2"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#fff"
                strokeWidth="2"
                strokeDasharray={`${analysisResult.score}, 100`}
                className="animate-progress"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-4xl font-bold">{analysisResult.score}</span>
              <span className="text-sm opacity-80">Điểm</span>
            </div>
          </div>
          <h3 className="mt-4 text-xl font-bold">Chất lượng CV</h3>
          <p className="text-center text-blue-100 text-sm mt-2">
            {analysisResult.score >= 80
              ? "CV của bạn rất ấn tượng!"
              : analysisResult.score >= 60
              ? "Khá tốt, nhưng cần cải thiện thêm."
              : "Cần sửa lại nhiều phần quan trọng."}
          </p>
        </Card>

        {/* Actionable Suggestions */}
        <Card className="p-6 md:w-2/3">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <Award className="text-yellow-500" /> Lời khuyên cải thiện
          </h3>
          <ul className="space-y-3">
            {analysisResult.suggestions.map((sug, idx) => (
              <li
                key={idx}
                className="flex gap-3 items-start bg-yellow-50 p-3 rounded-lg border border-yellow-100"
              >
                <div className="mt-0.5 min-w-[20px]">
                  <Star size={18} className="text-yellow-600" />
                </div>
                <span className="text-gray-700 text-sm">{sug}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 border-t-4 border-t-green-500">
          <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
            <CheckCircle size={20} /> Điểm mạnh
          </h3>
          <ul className="space-y-2">
            {analysisResult.strengths.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-gray-600 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>{" "}
                {item}
              </li>
            ))}
          </ul>
        </Card>

        <Card className="p-6 border-t-4 border-t-red-500">
          <h3 className="font-bold text-red-700 mb-4 flex items-center gap-2">
            <AlertTriangle size={20} /> Điểm cần khắc phục
          </h3>
          <ul className="space-y-2">
            {analysisResult.weaknesses.map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-gray-600 text-sm"
              >
                <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>{" "}
                {item}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );

  const renderJobFit = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold text-gray-800">
            Độ phù hợp với công việc
          </h2>
          <span className="text-2xl font-bold text-blue-600">
            {matchResult.score}%
          </span>
        </div>
        <ProgressBar value={matchResult.score} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">Từ khóa còn thiếu</h3>
          <p className="text-sm text-gray-500 mb-4">
            Những kỹ năng/từ khóa này xuất hiện trong JD nhưng chưa thấy trong
            CV của bạn:
          </p>
          <div className="flex flex-wrap gap-2">
            {matchResult.missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-red-50 text-red-600 rounded-full text-sm font-medium border border-red-100"
              >
                {skill}
              </span>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-gray-800 mb-4">
            Nhận định của Chuyên gia
          </h3>
          <p className="text-gray-600 text-sm leading-relaxed bg-blue-50 p-4 rounded-lg">
            "{matchResult.advice}"
          </p>
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 italic">
              Mẹo: Hãy chỉnh sửa lại phần "Kỹ năng" và "Kinh nghiệm làm việc" để
              chèn các từ khóa còn thiếu một cách tự nhiên.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderTips = () => (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-10">
      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center gap-2">
          <Lightbulb className="text-yellow-600" size={28} /> Cẩm nang Phỏng vấn
        </h2>
        <p className="text-gray-600">
          Những lưu ý "vàng" giúp bạn tự tin và ghi điểm tuyệt đối trong mắt nhà
          tuyển dụng.
        </p>
      </div>

      <div className="space-y-6">
        {/* Trước phỏng vấn */}
        <Card className="p-6 border-l-4 border-l-blue-500 shadow-md">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            <Clock size={20} /> Trước buổi phỏng vấn (Chuẩn bị)
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">
                Nghiên cứu & Kiến thức
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Tìm hiểu kỹ về sản phẩm, văn hóa và đối thủ của công ty.
                </li>
                <li>Đọc kỹ lại JD để nắm rõ yêu cầu công việc.</li>
                <li>Chuẩn bị sẵn câu trả lời cho các câu hỏi phổ biến.</li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-semibold text-blue-700">
                Hậu cần & Trang phục
              </h4>
              <ul className="space-y-2 text-sm text-gray-600 list-disc list-inside">
                <li>
                  Chọn trang phục lịch sự, chuyên nghiệp (Business Casual).
                </li>
                <li>In sẵn 2-3 bản CV cứng (nếu phỏng vấn offline).</li>
                <li>
                  Kiểm tra Camera, Mic, Wifi 30 phút trước giờ (nếu online).
                </li>
                <li>Đến sớm hoặc online sớm ít nhất 10-15 phút.</li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Trong phỏng vấn */}
        <Card className="p-6 border-l-4 border-l-green-500 shadow-md">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
            <Smile size={20} /> Trong buổi phỏng vấn (Thực hiện)
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Thái độ & Ngôn ngữ cơ thể
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" /> Luôn
                  mỉm cười và duy trì giao tiếp mắt (Eye contact).
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" /> Ngồi
                  thẳng lưng, thể hiện sự tự tin nhưng không kiêu ngạo.
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" /> Lắng
                  nghe kỹ câu hỏi, không ngắt lời người phỏng vấn.
                </li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-700 mb-2">
                Nội dung trả lời
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" /> Trả
                  lời trọng tâm, ngắn gọn, súc tích (1-2 phút/câu).
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" />{" "}
                  Trung thực về những gì mình biết và chưa biết.
                </li>
                <li className="flex gap-2 items-start">
                  <CheckCircle size={14} className="mt-1 text-green-500" />{" "}
                  <strong>Quan trọng:</strong> Hãy chuẩn bị câu hỏi ngược lại
                  cho NTD.
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Sau phỏng vấn */}
        <Card className="p-6 border-l-4 border-l-purple-500 shadow-md">
          <h3 className="text-xl font-bold text-purple-800 mb-4 flex items-center gap-2">
            <Mail size={20} /> Sau buổi phỏng vấn (Kết thúc)
          </h3>
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-bold text-purple-700 mb-1">
                Gửi thư cảm ơn (Thank-you Letter)
              </h4>
              <p className="text-sm text-gray-600 mb-2">
                Gửi email cảm ơn trong vòng 24h sau buổi phỏng vấn. Đây là cơ
                hội để bạn nhắc lại sự quan tâm của mình và tạo ấn tượng chuyên
                nghiệp.
              </p>
              <div className="text-xs bg-white p-2 rounded border border-purple-100 text-gray-500 italic">
                "Cảm ơn anh/chị [Tên] đã dành thời gian phỏng vấn em hôm nay. Em
                rất ấn tượng với [Điều gì đó về công ty]..."
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Tự đánh giá lại buổi phỏng vấn: Những câu hỏi nào mình trả lời
                  chưa tốt?
                </li>
                <li>
                  Nếu sau 1 tuần chưa có phản hồi, hãy gửi email hỏi thăm
                  (Follow-up) lịch sự.
                </li>
              </ul>
              <ul className="list-disc list-inside space-y-1">
                <li>
                  Thông báo cho người tham chiếu (Reference) nếu NTD yêu cầu.
                </li>
                <li>Giữ thái độ chuyên nghiệp dù kết quả là Đậu hay Trượt.</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderInterview = () => (
    <div className="max-w-4xl mx-auto h-[calc(100vh-80px)] md:h-[600px] flex flex-col bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      {/* Header */}
      <div className="bg-blue-600 p-4 text-white flex justify-between items-center shadow-md z-10">
        <div>
          <h2 className="font-bold text-lg flex items-center gap-2">
            <MessageSquare size={20} /> Coach Phỏng Vấn AI
          </h2>
          <p className="text-blue-100 text-xs">
            Chế độ huấn luyện chuyên sâu: Hỏi - Đáp - Sửa lỗi
          </p>
        </div>
        {!interviewStarted && (
          <Button
            variant="secondary"
            onClick={startInterview}
            className="text-xs py-1 px-3 shadow-none border-none"
          >
            Bắt đầu Coach
          </Button>
        )}
        {interviewStarted && (
          <div className="text-xs bg-blue-700 px-3 py-1 rounded-full flex items-center gap-1">
            <Clock size={12} /> Câu hỏi {currentQuestionIndex + 1}/
            {INTERVIEW_DATA.length}
          </div>
        )}
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-6">
        {!interviewStarted ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 text-center p-8">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6 text-blue-600 animate-bounce-slow">
              <Award size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              Sẵn sàng chinh phục nhà tuyển dụng?
            </h3>
            <p className="max-w-md mb-8 text-gray-600">
              Tôi sẽ đóng vai nhà tuyển dụng khó tính. Với mỗi câu trả lời của
              bạn, tôi sẽ:
              <br />
              1. Nhận xét điểm mạnh/yếu.
              <br />
              2. Đưa ra <strong>Câu trả lời mẫu điểm 10</strong>.<br />
              3. Chỉ bạn bí kíp tâm lý để "chốt sale" vị trí này.
            </p>
            <Button onClick={startInterview} className="px-8 py-3 text-lg">
              Bắt đầu Phỏng vấn Thử
            </Button>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => renderMessage(msg, idx))}
            {isTyping && (
              <div className="flex items-center gap-2 text-gray-400 text-xs ml-4 animate-pulse">
                <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-200"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animation-delay-400"></div>
                AI đang phân tích câu trả lời...
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      {interviewStarted && (
        <div className="p-4 bg-white border-t border-gray-200">
          {/* Hint Area */}
          <div className="mb-3 flex justify-between items-center">
            {!showHint ? (
              <button
                onClick={() => setShowHint(true)}
                className="text-xs text-amber-600 font-bold flex items-center gap-1 hover:bg-amber-50 px-2 py-1 rounded transition-colors"
              >
                <Lightbulb size={14} /> Xem gợi ý trả lời (Bí kíp)
              </button>
            ) : (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-sm w-full border border-amber-200 animate-fade-in relative">
                <button
                  onClick={() => setShowHint(false)}
                  className="absolute top-2 right-2 text-amber-500 hover:text-amber-700"
                >
                  <X size={14} />
                </button>
                <strong className="block mb-1 flex items-center gap-1">
                  <Unlock size={14} /> Gợi ý chiến thuật:
                </strong>
                {INTERVIEW_DATA[currentQuestionIndex]?.hint}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <textarea
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isTyping}
              placeholder="Nhập câu trả lời của bạn ở đây..."
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-100 text-sm resize-none h-[60px]"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!currentInput.trim() || isTyping}
              className="px-6 h-[60px]"
            >
              <Send size={20} />
            </Button>
          </div>
          <p className="text-[10px] text-gray-400 mt-2 text-center">
            Mẹo: Nhấn Enter để gửi. Trả lời càng chi tiết, AI phân tích càng
            chuẩn.
          </p>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col md:flex-row text-gray-800">
      {renderSidebar()}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center md:hidden">
          <div className="font-bold text-xl text-blue-600">CV Coach Pro</div>
        </header>

        {activeTab === "input" && renderInputSection()}
        {activeTab === "analyze" && renderAnalysis()}
        {activeTab === "match" && renderJobFit()}
        {activeTab === "interview" && renderInterview()}
        {activeTab === "tips" && renderTips()}
      </main>
    </div>
  );
}
