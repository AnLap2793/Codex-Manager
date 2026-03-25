export const UI_LOCALES = ["zh-CN", "en", "vi"] as const;
export type UiLocale = (typeof UI_LOCALES)[number];

export const DEFAULT_UI_LOCALE: UiLocale = "zh-CN";
export const UI_LOCALE_STORAGE_KEY = "codexmanager.ui-locale";

type LocaleOverrides = Partial<Record<UiLocale, string>>;

const UI_TRANSLATIONS: Record<string, Partial<Record<Exclude<UiLocale, "zh-CN">, string>>> = {
  "仪表盘": { en: "Dashboard", vi: "Bảng điều khiển" },
  "账号管理": { en: "Accounts", vi: "Quản lý tài khoản" },
  "聚合API": { en: "Aggregate APIs", vi: "API tổng hợp" },
  "平台密钥": { en: "API Keys", vi: "Khóa nền tảng" },
  "请求日志": { en: "Request Logs", vi: "Nhật ký yêu cầu" },
  "设置": { en: "Settings", vi: "Cài đặt" },
  "应用设置": { en: "App Settings", vi: "Cài đặt ứng dụng" },
  "账户池 · 用量管理": {
    en: "Account Pool · Usage Management",
    vi: "Kho tài khoản · Quản lý mức dùng",
  },
  "收起侧边栏": { en: "Collapse Sidebar", vi: "Thu gọn thanh bên" },
  "密码": { en: "Password", vi: "Mật khẩu" },
  "服务已连接": { en: "Service Connected", vi: "Dịch vụ đã kết nối" },
  "服务未连接": { en: "Service Disconnected", vi: "Dịch vụ chưa kết nối" },
  "监听端口": { en: "Port", vi: "Cổng lắng nghe" },
  "服务已启动": { en: "Service started", vi: "Dịch vụ đã khởi động" },
  "服务已停止": { en: "Service stopped", vi: "Dịch vụ đã dừng" },
  "操作失败: {message}": { en: "Action failed: {message}", vi: "Thao tác thất bại: {message}" },
  "地址保存失败: {message}": {
    en: "Failed to save address: {message}",
    vi: "Lưu địa chỉ thất bại: {message}",
  },
  "总账号数": { en: "Total Accounts", vi: "Tổng tài khoản" },
  "池中所有配置账号": {
    en: "All configured accounts in the pool",
    vi: "Tất cả tài khoản đã cấu hình trong pool",
  },
  "最近日志 {count} 条": {
    en: "{count} recent logs",
    vi: "{count} log gần đây",
  },
  "可用账号": { en: "Available Accounts", vi: "Tài khoản khả dụng" },
  "当前健康可调用的账号": {
    en: "Accounts currently healthy and routable",
    vi: "Tài khoản hiện khỏe và có thể định tuyến",
  },
  "不可用账号": { en: "Unavailable Accounts", vi: "Tài khoản không khả dụng" },
  "额度耗尽或授权失效": {
    en: "Quota exhausted or authorization expired",
    vi: "Hết hạn mức hoặc ủy quyền đã hết hiệu lực",
  },
  "账号池剩余": { en: "Pool Remaining", vi: "Mức còn lại của pool" },
  "5小时内": { en: "Within 5 hours", vi: "Trong 5 giờ" },
  "7天内": { en: "Within 7 days", vi: "Trong 7 ngày" },
  "今日令牌": { en: "Today's Tokens", vi: "Token hôm nay" },
  "输入 + 输出合计": { en: "Input + output total", vi: "Tổng input + output" },
  "缓存令牌": { en: "Cached Tokens", vi: "Token cache" },
  "上下文缓存命中": { en: "Context cache hits", vi: "Lượt trúng cache ngữ cảnh" },
  "推理令牌": { en: "Reasoning Tokens", vi: "Token suy luận" },
  "大模型思考过程": { en: "Model reasoning workload", vi: "Khối lượng suy luận của mô hình" },
  "预计费用": { en: "Estimated Cost", vi: "Chi phí ước tính" },
  "按官价估算": { en: "Estimated using official pricing", vi: "Ước tính theo giá niêm yết" },
  "当前活跃账号": { en: "Active Account", vi: "Tài khoản đang hoạt động" },
  "5小时剩余": { en: "5h remaining", vi: "Còn lại 5h" },
  "7天剩余": { en: "7d remaining", vi: "Còn lại 7 ngày" },
  "剩余额度": { en: "Remaining quota", vi: "Hạn mức còn lại" },
  "暂无可识别的活跃账号": {
    en: "No active account could be identified",
    vi: "Chưa xác định được tài khoản hoạt động",
  },
  "正在等待服务连接": {
    en: "Waiting for service connection",
    vi: "Đang chờ dịch vụ kết nối",
  },
  "智能推荐": { en: "Smart Recommendations", vi: "Đề xuất thông minh" },
  "基于当前配额，系统会优先推荐剩余额度更高且仍可参与路由的账号。": {
    en: "Based on current quota, the system prefers accounts with more remaining quota that can still participate in routing.",
    vi: "Dựa trên hạn mức hiện tại, hệ thống ưu tiên các tài khoản còn nhiều quota hơn và vẫn có thể tham gia định tuyến.",
  },
  "5小时优先账号": { en: "Preferred 5h Account", vi: "Tài khoản ưu tiên 5h" },
  "7天优先账号": { en: "Preferred 7d Account", vi: "Tài khoản ưu tiên 7 ngày" },
  "当前没有可推荐的可用账号。": {
    en: "There are no available accounts to recommend right now.",
    vi: "Hiện không có tài khoản khả dụng nào để đề xuất.",
  },
  "正在等待服务连接。": {
    en: "Waiting for service connection.",
    vi: "Đang chờ dịch vụ kết nối.",
  },
  "占比": { en: "Ratio", vi: "Tỷ lệ" },
  "免责声明": { en: "Disclaimer", vi: "Tuyên bố miễn trừ" },
  "查看免责声明": { en: "View disclaimer", vi: "Xem tuyên bố miễn trừ" },
  "详情": { en: "Details", vi: "Chi tiết" },
  "以下内容与 README 保持一致，适合作为使用前的统一提示。": {
    en: "The following content matches the README and serves as a unified pre-use notice.",
    vi: "Nội dung dưới đây khớp với README và dùng làm thông báo thống nhất trước khi sử dụng.",
  },
  "我知道了": { en: "Got it", vi: "Tôi đã hiểu" },
  "本项目仅用于学习与开发目的。": {
    en: "This project is for learning and development purposes only.",
    vi: "Dự án này chỉ dành cho mục đích học tập và phát triển.",
  },
  "使用者必须遵守相关平台的服务条款，例如 OpenAI、Anthropic。": {
    en: "Users must comply with the terms of service of the relevant platforms, such as OpenAI and Anthropic.",
    vi: "Người dùng phải tuân thủ điều khoản dịch vụ của các nền tảng liên quan như OpenAI và Anthropic.",
  },
  "作者不提供或分发任何账号、API Key 或代理服务，也不对本软件的具体使用方式负责。": {
    en: "The author does not provide or distribute any accounts, API keys, or proxy services, and is not responsible for specific usage of this software.",
    vi: "Tác giả không cung cấp hay phân phối bất kỳ tài khoản, API key hoặc dịch vụ proxy nào, và không chịu trách nhiệm cho cách sử dụng cụ thể của phần mềm này.",
  },
  "请勿使用本项目绕过速率限制或服务限制。": {
    en: "Do not use this project to bypass rate limits or service restrictions.",
    vi: "Không sử dụng dự án này để vượt qua giới hạn tốc độ hoặc giới hạn dịch vụ.",
  },
  "确定": { en: "Confirm", vi: "Xác nhận" },
  "取消": { en: "Cancel", vi: "Hủy" },
  "删除": { en: "Delete", vi: "Xóa" },
  "清空": { en: "Clear", vi: "Xóa sạch" },
  "关闭": { en: "Close", vi: "Đóng" },
  "完成": { en: "Done", vi: "Hoàn tất" },
  "保存中...": { en: "Saving...", vi: "Đang lưu..." },
  "立即刷新": { en: "Refresh Now", vi: "Làm mới ngay" },
  "正在刷新...": { en: "Refreshing...", vi: "Đang làm mới..." },
  "未知": { en: "Unknown", vi: "Không rõ" },
  "未知时间": { en: "Unknown time", vi: "Thời gian không rõ" },
  "未提供": { en: "Unavailable", vi: "Không có" },
  "剩余": { en: "remaining", vi: "còn lại" },
  "已使用 {value}": { en: "Used {value}", vi: "Đã dùng {value}" },
  "重置时间: {value}": { en: "Reset: {value}", vi: "Đặt lại: {value}" },
  "数据捕获于: {value}": {
    en: "Captured at: {value}",
    vi: "Dữ liệu ghi nhận lúc: {value}",
  },
  "用量详情": { en: "Usage Details", vi: "Chi tiết mức dùng" },
  "账号: {name} ({id})": {
    en: "Account: {name} ({id})",
    vi: "Tài khoản: {name} ({id})",
  },
  "5小时额度": { en: "5h quota", vi: "Hạn mức 5 giờ" },
  "7天周期额度": { en: "7d cycle quota", vi: "Hạn mức chu kỳ 7 ngày" },
  "请输入端口或地址": { en: "Please enter a port or address", vi: "Vui lòng nhập cổng hoặc địa chỉ" },
  "未知错误": { en: "Unknown error", vi: "Lỗi không rõ" },
  "连接超时": { en: "Connection timed out", vi: "Kết nối bị quá thời gian" },
  "连接被拒绝": { en: "Connection refused", vi: "Kết nối bị từ chối" },
  "服务返回空响应（可能启动未完成、已异常退出或端口被占用）": {
    en: "The service returned an empty response (it may still be starting, may have crashed, or the port may be occupied).",
    vi: "Dịch vụ trả về phản hồi rỗng (có thể vẫn đang khởi động, đã thoát bất thường hoặc cổng đang bị chiếm).",
  },
  "地址解析失败": { en: "Failed to resolve address", vi: "Phân giải địa chỉ thất bại" },
  "地址为空": { en: "Address is empty", vi: "Địa chỉ đang trống" },
  "地址不合法": { en: "Invalid address", vi: "Địa chỉ không hợp lệ" },
  "当前环境不支持复制，请手动复制。": {
    en: "Copy is not supported in the current environment. Please copy manually.",
    vi: "Môi trường hiện tại không hỗ trợ sao chép. Vui lòng sao chép thủ công.",
  },
  "可用": { en: "Available", vi: "Khả dụng" },
  "封禁": { en: "Banned", vi: "Bị cấm" },
  "不可用": { en: "Unavailable", vi: "Không khả dụng" },
  "已禁用": { en: "Disabled", vi: "Đã vô hiệu hóa" },
  "仅7天额度": { en: "7d quota only", vi: "Chỉ có quota 7 ngày" },
  "7天窗口未提供": { en: "7d window unavailable", vi: "Không có cửa sổ 7 ngày" },
  "用量缺失": { en: "Usage missing", vi: "Thiếu dữ liệu mức dùng" },
  "准备环境": { en: "Preparing Environment", vi: "Đang chuẩn bị môi trường" },
  "正在准备环境": { en: "Preparing Environment", vi: "Đang chuẩn bị môi trường" },
  "正在同步本地配置，请稍候...": {
    en: "Syncing local configuration, please wait...",
    vi: "Đang đồng bộ cấu hình cục bộ, vui lòng chờ...",
  },
  "当前 Web 运行方式不受支持": {
    en: "The current web runtime mode is not supported",
    vi: "Chế độ chạy web hiện tại không được hỗ trợ",
  },
  "无法同步核心服务状态": {
    en: "Unable to sync core service state",
    vi: "Không thể đồng bộ trạng thái dịch vụ cốt lõi",
  },
  "请通过 `codexmanager-web` 打开页面，或在反向代理中同时提供 `/api/runtime` 与 `/api/rpc`。": {
    en: "Open the page through `codexmanager-web`, or expose both `/api/runtime` and `/api/rpc` in your reverse proxy.",
    vi: "Hãy mở trang qua `codexmanager-web`, hoặc cung cấp cả `/api/runtime` và `/api/rpc` trong reverse proxy.",
  },
  "重试": { en: "Retry", vi: "Thử lại" },
  "强制启动": { en: "Force Start", vi: "Buộc khởi động" },
  "服务初始化失败: {addr}": {
    en: "Service initialization failed: {addr}",
    vi: "Khởi tạo dịch vụ thất bại: {addr}",
  },
  "账号轮转": { en: "Account rotation", vi: "Luân phiên tài khoản" },
  "聚合API轮转": { en: "Aggregate API rotation", vi: "Luân phiên API tổng hợp" },
  "OpenAI 兼容": { en: "OpenAI compatible", vi: "Tương thích OpenAI" },
  "Claude Code 兼容": { en: "Claude Code compatible", vi: "Tương thích Claude Code" },
  "跟随请求": { en: "Follow request", vi: "Theo request" },
  "低 (low)": { en: "Low (low)", vi: "Thấp (low)" },
  "中 (medium)": { en: "Medium (medium)", vi: "Trung bình (medium)" },
  "高 (high)": { en: "High (high)", vi: "Cao (high)" },
  "极高 (xhigh)": { en: "Very high (xhigh)", vi: "Rất cao (xhigh)" },
  "服务未连接，暂时无法{actionLabel}": {
    en: "Service is disconnected, unable to {actionLabel} right now",
    vi: "Dịch vụ chưa kết nối, hiện chưa thể {actionLabel}",
  },
  "密钥已创建": { en: "Key created", vi: "Đã tạo khóa" },
  "创建失败: {message}": { en: "Create failed: {message}", vi: "Tạo thất bại: {message}" },
  "密钥已删除": { en: "Key deleted", vi: "Đã xóa khóa" },
  "删除失败: {message}": { en: "Delete failed: {message}", vi: "Xóa thất bại: {message}" },
  "密钥配置已更新": { en: "Key configuration updated", vi: "Cấu hình khóa đã được cập nhật" },
  "更新失败: {message}": { en: "Update failed: {message}", vi: "Cập nhật thất bại: {message}" },
  "状态已更新": { en: "Status updated", vi: "Trạng thái đã cập nhật" },
  "更新状态失败: {message}": {
    en: "Failed to update status: {message}",
    vi: "Cập nhật trạng thái thất bại: {message}",
  },
  "模型列表已刷新": { en: "Model list refreshed", vi: "Danh sách model đã được làm mới" },
  "刷新模型失败: {message}": {
    en: "Failed to refresh models: {message}",
    vi: "Làm mới model thất bại: {message}",
  },
  "读取密钥失败: {message}": {
    en: "Failed to read key: {message}",
    vi: "Đọc khóa thất bại: {message}",
  },
  "读取中...": { en: "Loading...", vi: "Đang đọc..." },
  "已复制到剪贴板": { en: "Copied to clipboard", vi: "Đã sao chép vào clipboard" },
  "未命名": { en: "Unnamed", vi: "Chưa đặt tên" },
  "启用": { en: "Enabled", vi: "Bật" },
  "禁用": { en: "Disabled", vi: "Tắt" },
  "编辑配置": { en: "Edit configuration", vi: "Chỉnh sửa cấu hình" },
  "设置模型与推理": {
    en: "Configure model and reasoning",
    vi: "Thiết lập model và mức suy luận",
  },
  "删除密钥": { en: "Delete key", vi: "Xóa khóa" },
  "删除平台密钥": { en: "Delete API key", vi: "Xóa khóa nền tảng" },
  "确定删除平台密钥 {name} 吗？删除后不可恢复。": {
    en: "Delete API key {name}? This action cannot be undone.",
    vi: "Xóa khóa nền tảng {name}? Hành động này không thể hoàn tác.",
  },
  "创建和管理网关调用所需的访问令牌": {
    en: "Create and manage access tokens for gateway requests",
    vi: "Tạo và quản lý access token dùng cho gateway",
  },
  "刷新模型": { en: "Refresh models", vi: "Làm mới model" },
  "创建密钥": { en: "Create key", vi: "Tạo khóa" },
  "密钥 / ID": { en: "Key / ID", vi: "Khóa / ID" },
  "名称": { en: "Name", vi: "Tên" },
  "协议": { en: "Protocol", vi: "Giao thức" },
  "轮转策略": { en: "Rotation strategy", vi: "Chiến lược luân phiên" },
  "绑定模型": { en: "Bound model", vi: "Model gắn kèm" },
  "总使用 Token": { en: "Total token usage", vi: "Tổng token đã dùng" },
  "状态": { en: "Status", vi: "Trạng thái" },
  "操作": { en: "Actions", vi: "Thao tác" },
  "暂无平台密钥，点击右上角创建": {
    en: "No API keys yet. Create one from the top right.",
    vi: "Chưa có khóa nền tảng nào. Hãy tạo ở góc trên bên phải.",
  },
  "搜索账号名 / 编号...": {
    en: "Search account name / ID...",
    vi: "Tìm tên tài khoản / ID...",
  },
  "全部类型": { en: "All types", vi: "Tất cả loại" },
  "全部状态": { en: "All statuses", vi: "Tất cả trạng thái" },
  "低配额": { en: "Low quota", vi: "Quota thấp" },
  "全部": { en: "All", vi: "Tất cả" },
  "优先": { en: "Preferred", vi: "Ưu tiên" },
  "从未刷新": { en: "Never refreshed", vi: "Chưa từng làm mới" },
  "账号类型": { en: "Plan type", vi: "Loại tài khoản" },
  "当前状态": { en: "Current status", vi: "Trạng thái hiện tại" },
  "标签": { en: "Tags", vi: "Nhãn" },
  "备注": { en: "Notes", vi: "Ghi chú" },
  "账号 ID": { en: "Account ID", vi: "ID tài khoản" },
  "未设置": { en: "Not set", vi: "Chưa thiết lập" },
  "按文件导入": { en: "Import by file", vi: "Nhập bằng tệp" },
  "选择文件导入": { en: "Choose file import", vi: "Chọn tệp để nhập" },
  "按文件夹导入": { en: "Import by folder", vi: "Nhập bằng thư mục" },
  "选择目录导入": { en: "Choose folder import", vi: "Chọn thư mục để nhập" },
  "导出到浏览器": { en: "Export to browser", vi: "Xuất qua trình duyệt" },
  "导出账号": { en: "Export accounts", vi: "Xuất tài khoản" },
  "请先选择要删除的账号": {
    en: "Please select accounts to delete first",
    vi: "Vui lòng chọn tài khoản cần xóa trước",
  },
  "当前没有可清理的封禁账号": {
    en: "There are no banned accounts to clean up",
    vi: "Hiện không có tài khoản bị cấm nào để dọn dẹp",
  },
  "请输入账号名称": { en: "Please enter an account name", vi: "Vui lòng nhập tên tài khoản" },
  "请输入顺序值": { en: "Please enter a sort value", vi: "Vui lòng nhập giá trị sắp xếp" },
  "顺序必须是数字": { en: "Sort value must be numeric", vi: "Giá trị sắp xếp phải là số" },
  "账号操作": { en: "Account Actions", vi: "Thao tác tài khoản" },
  "添加账号": { en: "Add account", vi: "Thêm tài khoản" },
  "清理": { en: "Cleanup", vi: "Dọn dẹp" },
  "删除选中账号": { en: "Delete selected accounts", vi: "Xóa tài khoản đã chọn" },
  "一键清理不可用免费": {
    en: "Clean unavailable free accounts",
    vi: "Dọn tài khoản miễn phí không khả dụng",
  },
  "一键清理封禁账号": {
    en: "Clean banned accounts",
    vi: "Dọn tài khoản bị cấm",
  },
  "刷新账号用量": { en: "Refresh account usage", vi: "Làm mới mức dùng tài khoản" },
  "账号信息": { en: "Account info", vi: "Thông tin tài khoản" },
  "5h 额度": { en: "5h quota", vi: "Quota 5h" },
  "7d 额度": { en: "7d quota", vi: "Quota 7d" },
  "顺序": { en: "Sort", vi: "Thứ tự" },
  "未找到符合条件的账号": {
    en: "No matching accounts found",
    vi: "Không tìm thấy tài khoản phù hợp",
  },
  "5小时": { en: "5 hours", vi: "5 giờ" },
  "7天": { en: "7 days", vi: "7 ngày" },
  "编辑账号信息": { en: "Edit account", vi: "Chỉnh sửa tài khoản" },
  "详情与日志": { en: "Details and logs", vi: "Chi tiết và log" },
  "设为优先": { en: "Set as preferred", vi: "Đặt làm ưu tiên" },
  "取消优先": { en: "Unset preferred", vi: "Bỏ ưu tiên" },
  "共 {count} 个账号": { en: "{count} accounts total", vi: "Tổng cộng {count} tài khoản" },
  "已选择 {count} 个": { en: "{count} selected", vi: "Đã chọn {count}" },
  "每页显示": { en: "Per page", vi: "Mỗi trang" },
  "上一页": { en: "Previous", vi: "Trang trước" },
  "下一页": { en: "Next", vi: "Trang sau" },
  "第 {page} / {totalPages} 页": {
    en: "Page {page} / {totalPages}",
    vi: "Trang {page} / {totalPages}",
  },
  "启用账号": { en: "Enable account", vi: "Bật tài khoản" },
  "恢复账号": { en: "Restore account", vi: "Khôi phục tài khoản" },
  "禁用账号": { en: "Disable account", vi: "Tắt tài khoản" },
  "重置: {value}": { en: "Reset: {value}", vi: "Đặt lại: {value}" },
  "最近刷新: {value}": { en: "Last refreshed: {value}", vi: "Lần làm mới gần nhất: {value}" },
  "全部 ({count})": { en: "All ({count})", vi: "Tất cả ({count})" },
  "可用 ({count})": { en: "Available ({count})", vi: "Khả dụng ({count})" },
  "低配额 ({count})": { en: "Low quota ({count})", vi: "Quota thấp ({count})" },
  "封禁 ({count})": { en: "Banned ({count})", vi: "Bị cấm ({count})" },
  "服务未连接，账号列表与相关操作暂不可用；连接恢复后会自动继续加载。": {
    en: "The service is disconnected. The account list and related actions are temporarily unavailable and will resume loading automatically once the connection is restored.",
    vi: "Dịch vụ chưa kết nối. Danh sách tài khoản và các thao tác liên quan tạm thời chưa khả dụng, và sẽ tự động tải lại khi kết nối được khôi phục.",
  },
  "删除账号": { en: "Delete account", vi: "Xóa tài khoản" },
  "批量删除账号": { en: "Bulk delete accounts", vi: "Xóa nhiều tài khoản" },
  "确定删除账号 {name} 吗？删除后不可恢复。": {
    en: "Delete account {name}? This action cannot be undone.",
    vi: "Xóa tài khoản {name}? Hành động này không thể hoàn tác.",
  },
  "确定删除选中的 {count} 个账号吗？删除后不可恢复。": {
    en: "Delete the selected {count} accounts? This action cannot be undone.",
    vi: "Xóa {count} tài khoản đã chọn? Hành động này không thể hoàn tác.",
  },
  "修改 {name} 的名称、标签、备注与排序。": {
    en: "Update the name, tags, notes, and sort order for {name}.",
    vi: "Cập nhật tên, nhãn, ghi chú và thứ tự sắp xếp cho {name}.",
  },
  "修改账号的基础资料。": {
    en: "Update the account's basic information.",
    vi: "Cập nhật thông tin cơ bản của tài khoản.",
  },
  "账号名称": { en: "Account name", vi: "Tên tài khoản" },
  "标签（逗号分隔）": { en: "Tags (comma separated)", vi: "Nhãn (cách nhau bằng dấu phẩy)" },
  "例如：高频, 团队A": { en: "For example: high-frequency, team A", vi: "Ví dụ: tần suất cao, đội A" },
  "例如：主账号 / 测试号 / 团队共享": {
    en: "For example: primary account / test account / shared team account",
    vi: "Ví dụ: tài khoản chính / tài khoản test / tài khoản dùng chung của đội",
  },
  "顺序值": { en: "Sort value", vi: "Giá trị sắp xếp" },
  "值越小越靠前": { en: "Smaller values appear first", vi: "Giá trị càng nhỏ càng đứng trước" },
  "仅修改当前账号": { en: "Only update the current account", vi: "Chỉ cập nhật tài khoản hiện tại" },
  "保存": { en: "Save", vi: "Lưu" },
  "查询": { en: "Query", vi: "Truy vấn" },
  "共 {count} 条": { en: "{count} items", vi: "{count} mục" },
  "新建聚合 API": { en: "New aggregate API", vi: "Tạo API tổng hợp" },
  "供应商 / URL": { en: "Provider / URL", vi: "Nhà cung cấp / URL" },
  "类型": { en: "Type", vi: "Loại" },
  "测试连通性": { en: "Connectivity test", vi: "Kiểm tra kết nối" },
  "暂无聚合 API，点击右上角新建": {
    en: "No aggregate APIs yet. Create one from the top right.",
    vi: "Chưa có API tổng hợp nào. Hãy tạo ở góc trên bên phải.",
  },
  "暂无 {provider} 聚合 API": {
    en: "No {provider} aggregate APIs",
    vi: "Chưa có API tổng hợp {provider}",
  },
  "创建时间: {time}": { en: "Created: {time}", vi: "Tạo lúc: {time}" },
  "测试": { en: "Test", vi: "Kiểm tra" },
  "编辑聚合 API": { en: "Edit aggregate API", vi: "Chỉnh sửa API tổng hợp" },
  "删除聚合 API": { en: "Delete aggregate API", vi: "Xóa API tổng hợp" },
  "删除后将无法继续用于平台密钥轮转，是否确认删除？": {
    en: "After deletion it can no longer be used for API key rotation. Confirm delete?",
    vi: "Sau khi xóa, API này sẽ không thể tiếp tục dùng cho luân phiên khóa nền tảng. Xác nhận xóa?",
  },
  "已连通": { en: "Connected", vi: "Đã kết nối" },
  "失败": { en: "Failed", vi: "Thất bại" },
  "未测试": { en: "Not tested", vi: "Chưa kiểm tra" },
  "连通性测试成功": { en: "Connectivity test succeeded", vi: "Kiểm tra kết nối thành công" },
  "连通性测试失败: {message}": {
    en: "Connectivity test failed: {message}",
    vi: "Kiểm tra kết nối thất bại: {message}",
  },
  "测试失败: {message}": { en: "Test failed: {message}", vi: "Kiểm tra thất bại: {message}" },
  "聚合 API 已删除": { en: "Aggregate API deleted", vi: "Đã xóa API tổng hợp" },
  "当前聚合 API 已是优先渠道": {
    en: "This aggregate API is already the preferred channel",
    vi: "API tổng hợp này đã là kênh ưu tiên",
  },
  "已设为优先渠道": { en: "Set as preferred channel", vi: "Đã đặt làm kênh ưu tiên" },
  "设置优先失败: {message}": {
    en: "Failed to set preferred channel: {message}",
    vi: "Đặt kênh ưu tiên thất bại: {message}",
  },
  "后端未返回密钥明文": {
    en: "The backend did not return the plaintext key",
    vi: "Backend không trả về khóa dạng rõ",
  },
  "管理上游聚合地址与密钥，并测试连通性": {
    en: "Manage upstream aggregate endpoints and keys, and test connectivity",
    vi: "Quản lý endpoint và khóa API tổng hợp phía upstream, đồng thời kiểm tra kết nối",
  },
  "默认": { en: "Default", vi: "Mặc định" },
  "本地": { en: "Local", vi: "Cục bộ" },
  "自定义": { en: "Custom", vi: "Tùy chỉnh" },
  "供应商名称": { en: "Provider name", vi: "Tên nhà cung cấp" },
  "尝试链路": { en: "Attempt chain", vi: "Chuỗi thử" },
  "首尝试渠道": { en: "First attempted channel", vi: "Kênh thử đầu tiên" },
  "首尝试账号": { en: "First attempted account", vi: "Tài khoản thử đầu tiên" },
  "邮箱 / 名称": { en: "Email / name", vi: "Email / tên" },
  "方法": { en: "Method", vi: "Phương thức" },
  "显示地址": { en: "Displayed path", vi: "Đường dẫn hiển thị" },
  "记录地址": { en: "Recorded path", vi: "Đường dẫn ghi nhận" },
  "原始地址": { en: "Original path", vi: "Đường dẫn gốc" },
  "转发地址": { en: "Forwarded path", vi: "Đường dẫn chuyển tiếp" },
  "适配器": { en: "Adapter", vi: "Bộ chuyển đổi" },
  "上游": { en: "Upstream", vi: "Upstream" },
  "上游地址": { en: "Upstream URL", vi: "URL upstream" },
  "模型": { en: "Model", vi: "Model" },
  "推理": { en: "Reasoning", vi: "Suy luận" },
  "日志已清空": { en: "Logs cleared", vi: "Đã xóa log" },
  "成功请求": { en: "Successful requests", vi: "Yêu cầu thành công" },
  "客户端错误": { en: "Client errors", vi: "Lỗi phía client" },
  "服务端错误": { en: "Server errors", vi: "Lỗi phía server" },
  "{filtered}/{total} 条 · {label} · {refresh}": {
    en: "{filtered}/{total} items · {label} · {refresh}",
    vi: "{filtered}/{total} mục · {label} · {refresh}",
  },
  "5 秒刷新": { en: "refresh every 5s", vi: "làm mới mỗi 5 giây" },
  "搜索路径、账号或密钥...": {
    en: "Search path, account, or key...",
    vi: "Tìm đường dẫn, tài khoản hoặc khóa...",
  },
  "刷新": { en: "Refresh", vi: "Làm mới" },
  "清空日志": { en: "Clear logs", vi: "Xóa log" },
  "当前结果": { en: "Current results", vi: "Kết quả hiện tại" },
  "总日志 {count} 条": { en: "{count} total logs", vi: "Tổng {count} log" },
  "2XX 成功": { en: "2XX success", vi: "2XX thành công" },
  "状态码 200-299": { en: "Status codes 200-299", vi: "Mã trạng thái 200-299" },
  "异常请求": { en: "Failed requests", vi: "Yêu cầu lỗi" },
  "4xx / 5xx 或显式错误": { en: "4xx / 5xx or explicit errors", vi: "4xx / 5xx hoặc lỗi tường minh" },
  "累计令牌": { en: "Total tokens", vi: "Tổng token" },
  "当前筛选结果中的 total tokens": {
    en: "Total tokens in the current filtered result set",
    vi: "Tổng token trong kết quả lọc hiện tại",
  },
  "请求明细 按 {label} 展示": {
    en: "Request details shown by {label}",
    vi: "Chi tiết request hiển thị theo {label}",
  },
  "时间": { en: "Time", vi: "Thời gian" },
  "方法 / 路径": { en: "Method / Path", vi: "Phương thức / Đường dẫn" },
  "账号 / 密钥": { en: "Account / Key", vi: "Tài khoản / Khóa" },
  "模型 / 推理": { en: "Model / Reasoning", vi: "Model / Suy luận" },
  "请求时长": { en: "Duration", vi: "Thời lượng" },
  "令牌": { en: "Tokens", vi: "Token" },
  "错误": { en: "Error", vi: "Lỗi" },
  "服务未连接，无法获取日志": {
    en: "The service is disconnected, unable to fetch logs",
    vi: "Dịch vụ chưa kết nối, không thể lấy log",
  },
  "暂无请求日志": { en: "No request logs yet", vi: "Chưa có log request" },
  "总 {value}": { en: "Total {value}", vi: "Tổng {value}" },
  "输入 {value}": { en: "Input {value}", vi: "Input {value}" },
  "缓存 {value}": { en: "Cached {value}", vi: "Cache {value}" },
  "共 {count} 条匹配日志": { en: "{count} matching logs", vi: "{count} log khớp" },
  "清空请求日志": { en: "Clear request logs", vi: "Xóa nhật ký request" },
  "确定清空全部请求日志吗？该操作不可恢复。": {
    en: "Clear all request logs? This action cannot be undone.",
    vi: "Xóa toàn bộ nhật ký request? Hành động này không thể hoàn tác.",
  },
  "读取密码状态失败: {message}": {
    en: "Failed to read password status: {message}",
    vi: "Đọc trạng thái mật khẩu thất bại: {message}",
  },
  "当前运行环境暂不支持读取或保存访问密码": {
    en: "The current runtime does not support reading or saving the access password",
    vi: "Môi trường chạy hiện tại chưa hỗ trợ đọc hoặc lưu mật khẩu truy cập",
  },
  "请输入密码": { en: "Please enter a password", vi: "Vui lòng nhập mật khẩu" },
  "两次输入的密码不一致": {
    en: "The two password entries do not match",
    vi: "Hai lần nhập mật khẩu không khớp",
  },
  "访问密码已设置": { en: "Access password set", vi: "Đã đặt mật khẩu truy cập" },
  "保存失败: {message}": { en: "Save failed: {message}", vi: "Lưu thất bại: {message}" },
  "访问密码已清除": { en: "Access password cleared", vi: "Đã xóa mật khẩu truy cập" },
  "清除失败: {message}": { en: "Clear failed: {message}", vi: "Xóa thất bại: {message}" },
  "访问密码": { en: "Access password", vi: "Mật khẩu truy cập" },
  "该密码用于保护 Web 管理页访问。在桌面端或 Web 端修改后，都会写入同一份服务配置并立即生效。": {
    en: "This password protects access to the web management page. Changes made from either desktop or web are written to the same service configuration and take effect immediately.",
    vi: "Mật khẩu này dùng để bảo vệ truy cập vào trang quản trị web. Dù thay đổi từ desktop hay web, nó đều được ghi vào cùng một cấu hình dịch vụ và có hiệu lực ngay lập tức.",
  },
  "当前已启用访问密码保护": {
    en: "Access password protection is currently enabled",
    vi: "Bảo vệ bằng mật khẩu truy cập hiện đang được bật",
  },
  "当前未设置访问密码，Web 管理页处于公开状态": {
    en: "No access password is set. The web management page is currently public.",
    vi: "Hiện chưa đặt mật khẩu truy cập. Trang quản trị web đang ở trạng thái công khai.",
  },
  "新密码": { en: "New password", vi: "Mật khẩu mới" },
  "请输入新密码": { en: "Enter a new password", vi: "Nhập mật khẩu mới" },
  "确认新密码": { en: "Confirm new password", vi: "Xác nhận mật khẩu mới" },
  "请再次输入新密码": { en: "Enter the new password again", vi: "Nhập lại mật khẩu mới" },
  "清除密码": { en: "Clear password", vi: "Xóa mật khẩu" },
  "保存设置": { en: "Save settings", vi: "Lưu cài đặt" },
  "导入内容格式不正确。JSON 账号内容请整段粘贴；普通 Token 才按每行一个导入。": {
    en: "The import content format is invalid. Paste JSON account content as a whole block; only plain tokens should be imported one per line.",
    vi: "Định dạng nội dung import không hợp lệ. Với tài khoản JSON hãy dán nguyên khối; chỉ token thuần mới import theo từng dòng.",
  },
  "JSON 数组格式不正确，请检查括号和逗号后重试。": {
    en: "The JSON array format is invalid. Please check brackets and commas and try again.",
    vi: "Định dạng mảng JSON không hợp lệ. Vui lòng kiểm tra dấu ngoặc và dấu phẩy rồi thử lại.",
  },
  "服务未连接，账号授权与导入暂不可用；连接恢复后可继续操作。": {
    en: "The service is disconnected. Account authorization and import are temporarily unavailable and can continue once the connection is restored.",
    vi: "Dịch vụ chưa kết nối. Việc ủy quyền và import tài khoản tạm thời chưa khả dụng, và có thể tiếp tục sau khi kết nối được khôi phục.",
  },
  "当前运行环境暂不支持账号管理。": {
    en: "The current runtime does not support account management.",
    vi: "Môi trường chạy hiện tại chưa hỗ trợ quản lý tài khoản.",
  },
  "登录成功": { en: "Login successful", vi: "Đăng nhập thành công" },
  "登录失败，请重试": { en: "Login failed, please try again", vi: "Đăng nhập thất bại, vui lòng thử lại" },
  "登录失败：{message}": { en: "Login failed: {message}", vi: "Đăng nhập thất bại: {message}" },
  "已生成登录链接，正在等待授权完成...": {
    en: "A login link has been generated. Waiting for authorization to complete...",
    vi: "Đã tạo liên kết đăng nhập. Đang chờ quá trình ủy quyền hoàn tất...",
  },
  "登录超时，请重试或使用下方手动解析回调。": {
    en: "Login timed out. Please try again or use the manual callback parser below.",
    vi: "Đăng nhập đã hết thời gian chờ. Vui lòng thử lại hoặc dùng phần phân tích callback thủ công bên dưới.",
  },
  "开始登录授权": { en: "start login authorization", vi: "bắt đầu ủy quyền đăng nhập" },
  "已生成登录链接，请在浏览器中完成授权": {
    en: "A login link has been generated. Please complete authorization in your browser.",
    vi: "Đã tạo liên kết đăng nhập. Vui lòng hoàn tất ủy quyền trong trình duyệt.",
  },
  "未返回登录任务编号，请完成授权后使用手动解析。": {
    en: "No login task ID was returned. Please complete authorization and then use manual parsing.",
    vi: "Không nhận được mã tác vụ đăng nhập. Vui lòng hoàn tất ủy quyền rồi dùng phân tích thủ công.",
  },
  "启动登录失败: {message}": { en: "Failed to start login: {message}", vi: "Khởi động đăng nhập thất bại: {message}" },
  "解析登录回调": { en: "parse login callback", vi: "phân tích callback đăng nhập" },
  "请先粘贴回调链接": { en: "Please paste the callback URL first", vi: "Vui lòng dán URL callback trước" },
  "正在解析回调...": { en: "Parsing callback...", vi: "Đang phân tích callback..." },
  "解析失败: {message}": { en: "Parse failed: {message}", vi: "Phân tích thất bại: {message}" },
  "导入账号": { en: "import accounts", vi: "import tài khoản" },
  "导入完成：共{total}，新增{created}，更新{updated}，失败{failed}": {
    en: "Import complete: total {total}, created {created}, updated {updated}, failed {failed}",
    vi: "Import hoàn tất: tổng {total}, mới {created}, cập nhật {updated}, lỗi {failed}",
  },
  "导入失败: {message}": { en: "Import failed: {message}", vi: "Import thất bại: {message}" },
  "链接已复制": { en: "Link copied", vi: "Đã sao chép liên kết" },
  "新增账号": { en: "Add account", vi: "Thêm tài khoản" },
  "通过登录授权或批量导入文本内容来添加账号。": {
    en: "Add accounts by login authorization or by bulk importing text content.",
    vi: "Thêm tài khoản bằng ủy quyền đăng nhập hoặc import hàng loạt nội dung văn bản.",
  },
  "登录授权": { en: "Login authorization", vi: "Ủy quyền đăng nhập" },
  "批量导入": { en: "Bulk import", vi: "Import hàng loạt" },
  "服务未连接，账号授权与回调解析暂不可用；连接恢复后可继续操作。": {
    en: "The service is disconnected. Account authorization and callback parsing are temporarily unavailable and can continue once the connection is restored.",
    vi: "Dịch vụ chưa kết nối. Việc ủy quyền tài khoản và phân tích callback tạm thời chưa khả dụng, và có thể tiếp tục sau khi kết nối được khôi phục.",
  },
  "标签 (逗号分隔)": { en: "Tags (comma separated)", vi: "Nhãn (cách nhau bằng dấu phẩy)" },
  "备注/描述": { en: "Notes / description", vi: "Ghi chú / mô tả" },
  "例如：主号 / 测试号": { en: "For example: primary / test", vi: "Ví dụ: chính / test" },
  "手动解析回调 (当本地 48760 端口占用时)": {
    en: "Manual callback parsing (when local port 48760 is occupied)",
    vi: "Phân tích callback thủ công (khi cổng cục bộ 48760 đang bị chiếm)",
  },
  "粘贴浏览器跳转后的完整回调 URL (包含 state 和 code)": {
    en: "Paste the full callback URL after browser redirection (including state and code)",
    vi: "Dán đầy đủ URL callback sau khi trình duyệt chuyển hướng (bao gồm state và code)",
  },
  "解析": { en: "Parse", vi: "Phân tích" },
  "账号数据 (Token 可每行一个，JSON 可整段粘贴)": {
    en: "Account data (one token per line, or paste JSON as a whole block)",
    vi: "Dữ liệu tài khoản (mỗi token một dòng, hoặc dán nguyên khối JSON)",
  },
  "粘贴账号数据。普通 Token 可每行一个；完整 JSON / JSON 数组请整段粘贴。": {
    en: "Paste account data. Plain tokens can be one per line; full JSON / JSON arrays should be pasted as a whole block.",
    vi: "Dán dữ liệu tài khoản. Token thuần có thể để mỗi dòng một cái; JSON / mảng JSON đầy đủ hãy dán nguyên khối.",
  },
  "支持格式：ChatGPT 账号（Refresh Token）、 Claude Session 等。系统将自动识别格式并导入。": {
    en: "Supported formats include ChatGPT accounts (refresh token), Claude sessions, and more. The system will detect the format automatically.",
    vi: "Các định dạng được hỗ trợ gồm tài khoản ChatGPT (refresh token), Claude session và hơn thế nữa. Hệ thống sẽ tự nhận diện định dạng và import.",
  },
  "开始导入": { en: "Start import", vi: "Bắt đầu import" },
  "例如：https://api.openai.com/v1": { en: "Example: https://api.openai.com/v1", vi: "Ví dụ: https://api.openai.com/v1" },
  "例如：https://api.anthropic.com/v1": { en: "Example: https://api.anthropic.com/v1", vi: "Ví dụ: https://api.anthropic.com/v1" },
  "服务未连接，聚合 API 暂不可编辑；连接恢复后可继续操作。": {
    en: "The service is disconnected. Aggregate APIs are temporarily unavailable for editing and can continue once the connection is restored.",
    vi: "Dịch vụ chưa kết nối. API tổng hợp tạm thời chưa thể chỉnh sửa, và có thể tiếp tục sau khi kết nối được khôi phục.",
  },
  "当前运行环境暂不支持聚合 API 管理。": {
    en: "The current runtime does not support aggregate API management.",
    vi: "Môi trường chạy hiện tại chưa hỗ trợ quản lý API tổng hợp.",
  },
  "服务未连接，暂时无法保存聚合 API": {
    en: "The service is disconnected. Unable to save the aggregate API right now.",
    vi: "Dịch vụ chưa kết nối. Hiện chưa thể lưu API tổng hợp.",
  },
  "请输入聚合 API URL": { en: "Please enter an aggregate API URL", vi: "Vui lòng nhập URL API tổng hợp" },
  "请输入供应商名称": { en: "Please enter a provider name", vi: "Vui lòng nhập tên nhà cung cấp" },
  "请输入聚合 API 密钥": { en: "Please enter an aggregate API key", vi: "Vui lòng nhập khóa API tổng hợp" },
  "聚合 API 已更新": { en: "Aggregate API updated", vi: "Đã cập nhật API tổng hợp" },
  "聚合 API 已创建": { en: "Aggregate API created", vi: "Đã tạo API tổng hợp" },
  "创建聚合 API": { en: "Create aggregate API", vi: "Tạo API tổng hợp" },
  "配置一个最小转发上游，保存 URL 和密钥后即可用于平台密钥轮转。": {
    en: "Configure a minimal forwarding upstream. Once the URL and key are saved, it can be used for API key rotation.",
    vi: "Cấu hình một upstream chuyển tiếp tối thiểu. Sau khi lưu URL và khóa, API này có thể được dùng cho luân phiên khóa nền tảng.",
  },
  "供应商名称 *": { en: "Provider name *", vi: "Tên nhà cung cấp *" },
  "例如：官方中转、XX 供应商": { en: "For example: official relay, vendor XX", vi: "Ví dụ: relay chính thức, nhà cung cấp XX" },
  "值越小越靠前，用于聚合 API 轮转优先级": {
    en: "Smaller values rank first and are used as the aggregate API rotation priority.",
    vi: "Giá trị càng nhỏ càng đứng trước và được dùng làm độ ưu tiên luân phiên API tổng hợp.",
  },
  "请输入 URL": { en: "Enter a URL", vi: "Nhập URL" },
  "留空则保持原值": { en: "Leave blank to keep the current value", vi: "Để trống để giữ nguyên giá trị hiện tại" },
  "请输入密钥": { en: "Enter the key", vi: "Nhập khóa" },
  "新密钥已生成": { en: "A new key has been generated", vi: "Đã tạo khóa mới" },
  "服务未连接，平台密钥与模型配置暂不可编辑；连接恢复后可继续操作。": {
    en: "The service is disconnected. API keys and model configuration are temporarily unavailable for editing and can continue once the connection is restored.",
    vi: "Dịch vụ chưa kết nối. Khóa nền tảng và cấu hình model tạm thời chưa thể chỉnh sửa, và có thể tiếp tục sau khi kết nối được khôi phục.",
  },
  "当前运行环境暂不支持平台密钥管理。": {
    en: "The current runtime does not support API key management.",
    vi: "Môi trường chạy hiện tại chưa hỗ trợ quản lý khóa nền tảng.",
  },
  "服务未连接，暂时无法保存平台密钥": {
    en: "The service is disconnected. Unable to save the API key right now.",
    vi: "Dịch vụ chưa kết nối. Hiện chưa thể lưu khóa nền tảng.",
  },
  "平台密钥已创建": { en: "API key created", vi: "Đã tạo khóa nền tảng" },
  "密钥已复制": { en: "Key copied", vi: "Đã sao chép khóa" },
  "编辑平台密钥": { en: "Edit API key", vi: "Chỉnh sửa khóa nền tảng" },
  "创建平台密钥": { en: "Create API key", vi: "Tạo khóa nền tảng" },
  "配置网关访问凭据，您可以绑定特定模型、推理等级或自定义上游。": {
    en: "Configure gateway credentials. You can bind a specific model, reasoning level, or custom upstream.",
    vi: "Cấu hình thông tin truy cập gateway. Bạn có thể gắn model cụ thể, mức suy luận hoặc upstream tùy chỉnh.",
  },
  "密钥名称 (可选)": { en: "Key name (optional)", vi: "Tên khóa (tùy chọn)" },
  "例如：主机房 / 测试": { en: "For example: primary datacenter / test", vi: "Ví dụ: trung tâm chính / test" },
  "账号轮转保持现有路由逻辑；聚合API轮转会直接透传请求。": {
    en: "Account rotation keeps the existing routing logic; aggregate API rotation forwards requests directly.",
    vi: "Luân phiên tài khoản giữ nguyên logic định tuyến hiện tại; luân phiên API tổng hợp sẽ chuyển tiếp request trực tiếp.",
  },
  "协议类型": { en: "Protocol type", vi: "Loại giao thức" },
  "决定认证头和请求协议改写方式。": {
    en: "Determines how authentication headers and request protocol rewriting are handled.",
    vi: "Quyết định cách xử lý header xác thực và cách rewrite giao thức request.",
  },
  "绑定模型 (可选)": { en: "Bound model (optional)", vi: "Model gắn kèm (tùy chọn)" },
  "选择“跟随请求”时，会使用请求体里的实际模型；请求日志展示的是最终生效模型。": {
    en: "When 'Follow request' is selected, the actual model in the request body is used; request logs show the final effective model.",
    vi: "Khi chọn 'Theo request', model thực trong request body sẽ được dùng; nhật ký request hiển thị model có hiệu lực cuối cùng.",
  },
  "推理等级 (可选)": { en: "Reasoning level (optional)", vi: "Mức suy luận (tùy chọn)" },
  "跟随请求等级": { en: "Follow request level", vi: "Theo mức của request" },
  "会覆盖请求里的 reasoning effort。": {
    en: "Overrides the reasoning effort in the request.",
    vi: "Sẽ ghi đè reasoning effort trong request.",
  },
  "服务等级 (可选)": { en: "Service tier (optional)", vi: "Tầng dịch vụ (tùy chọn)" },
  "Fast 会映射为上游 priority，Flex 会直传为 flex。": {
    en: "Fast is mapped to upstream priority, while Flex is passed through as flex.",
    vi: "Fast sẽ được ánh xạ sang priority của upstream, còn Flex sẽ được truyền thẳng dưới dạng flex.",
  },
  "Azure 接入地址": { en: "Azure endpoint", vi: "Địa chỉ Azure endpoint" },
  "Azure 接口密钥": { en: "Azure API key", vi: "Khóa API Azure" },
  "平台密钥已生成": { en: "API key generated", vi: "Đã tạo khóa nền tảng" },
  "系统设置": { en: "System settings", vi: "Cài đặt hệ thống" },
  "管理应用行为、网关策略及后台任务": {
    en: "Manage app behavior, gateway strategy, and background tasks",
    vi: "Quản lý hành vi ứng dụng, chiến lược gateway và tác vụ nền",
  },
  "通用": { en: "General", vi: "Chung" },
  "外观": { en: "Appearance", vi: "Giao diện" },
  "网关": { en: "Gateway", vi: "Gateway" },
  "任务": { en: "Tasks", vi: "Tác vụ" },
  "环境": { en: "Environment", vi: "Môi trường" },
  "基础设置": { en: "Basic settings", vi: "Cài đặt cơ bản" },
  "控制应用启动和窗口行为": {
    en: "Control app startup and window behavior",
    vi: "Điều khiển hành vi khởi động ứng dụng và cửa sổ",
  },
  "自动检查更新": { en: "Automatically check for updates", vi: "Tự động kiểm tra cập nhật" },
  "启动时自动检测新版本": { en: "Check for new versions on startup", vi: "Tự động kiểm tra phiên bản mới khi khởi động" },
  "打开日志目录": { en: "Open log directory", vi: "Mở thư mục log" },
  "关闭时最小化到托盘": { en: "Minimize to tray when closing", vi: "Thu nhỏ xuống khay khi đóng" },
  "点击关闭按钮不会直接退出程序": {
    en: "Clicking the close button will not exit the application directly",
    vi: "Nhấn nút đóng sẽ không thoát ứng dụng ngay lập tức",
  },
  "视觉性能模式": { en: "Visual performance mode", vi: "Chế độ hiệu năng hiển thị" },
  "关闭毛玻璃等特效以提升低配电脑性能": {
    en: "Disable glassmorphism and other effects to improve performance on lower-end machines",
    vi: "Tắt hiệu ứng kính mờ và các hiệu ứng khác để cải thiện hiệu năng trên máy cấu hình thấp",
  },
  "服务监听": { en: "Service listener", vi: "Lắng nghe dịch vụ" },
  "监听地址": { en: "Listen address", vi: "Địa chỉ lắng nghe" },
  "当前访问地址": { en: "Current access address", vi: "Địa chỉ truy cập hiện tại" },
  "实际监听地址": { en: "Actual bind address", vi: "Địa chỉ bind thực tế" },
  "样式版本": { en: "Style version", vi: "Phiên bản giao diện" },
  "界面主题": { en: "UI theme", vi: "Chủ đề giao diện" },
  "网关策略": { en: "Gateway strategy", vi: "Chiến lược gateway" },
  "账号选路策略": { en: "Account routing strategy", vi: "Chiến lược định tuyến tài khoản" },
  "选择策略": { en: "Select strategy", vi: "Chọn chiến lược" },
  "顺序优先 (Ordered)": { en: "Ordered", vi: "Ưu tiên theo thứ tự" },
  "均衡轮询 (Balanced)": { en: "Balanced", vi: "Luân phiên cân bằng" },
  "Free 账号使用模型": { en: "Model for free accounts", vi: "Model dùng cho tài khoản free" },
  "请求体压缩": { en: "Request body compression", vi: "Nén request body" },
  "上游代理 (Proxy)": { en: "Upstream proxy", vi: "Proxy upstream" },
  "支持 http/https/socks5，留空表示直连。": {
    en: "Supports http/https/socks5. Leave empty for direct connection.",
    vi: "Hỗ trợ http/https/socks5. Để trống để kết nối trực tiếp.",
  },
  "SSE 保活间隔 (ms)": { en: "SSE keepalive interval (ms)", vi: "Khoảng giữ kết nối SSE (ms)" },
  "上游流式超时 (ms)": { en: "Upstream streaming timeout (ms)", vi: "Timeout stream upstream (ms)" },
  "后台任务线程": { en: "Background task threads", vi: "Luồng tác vụ nền" },
  "管理自动轮询和保活任务；": { en: "Manage automatic polling and keepalive tasks;", vi: "Quản lý polling tự động và tác vụ keepalive;" },
  "用量轮询线程": { en: "Usage polling thread", vi: "Luồng polling mức dùng" },
  "网关保活线程": { en: "Gateway keepalive thread", vi: "Luồng keepalive gateway" },
  "令牌刷新轮询": { en: "Token refresh polling", vi: "Polling làm mới token" },
  "间隔(秒)": { en: "Interval (sec)", vi: "Khoảng thời gian (giây)" },
  "Worker 并发参数": { en: "Worker concurrency settings", vi: "Tham số song song của worker" },
  "用量刷新并发": { en: "Usage refresh concurrency", vi: "Độ song song làm mới mức dùng" },
  "HTTP 因子": { en: "HTTP factor", vi: "Hệ số HTTP" },
  "HTTP 最小并发": { en: "HTTP minimum concurrency", vi: "Độ song song HTTP tối thiểu" },
  "流式因子": { en: "Streaming factor", vi: "Hệ số streaming" },
  "流式最小并发": { en: "Streaming minimum concurrency", vi: "Độ song song streaming tối thiểu" },
  "搜索变量...": { en: "Search variables...", vi: "Tìm biến..." },
  "当前值": { en: "Current value", vi: "Giá trị hiện tại" },
  "输入变量值": { en: "Enter variable value", vi: "Nhập giá trị biến" },
  "默认值:": { en: "Default value:", vi: "Giá trị mặc định:" },
  "空": { en: "empty", vi: "trống" },
  "保存修改": { en: "Save changes", vi: "Lưu thay đổi" },
  "恢复默认": { en: "Restore default", vi: "Khôi phục mặc định" },
  "请从左侧列表选择一个环境变量进行配置": {
    en: "Select an environment variable from the list on the left to configure it",
    vi: "Hãy chọn một biến môi trường từ danh sách bên trái để cấu hình",
  },
  "发现新版本": { en: "New version available", vi: "Đã phát hiện phiên bản mới" },
  "替换更新": { en: "Apply update", vi: "Áp dụng cập nhật" },
  "下载更新": { en: "Download update", vi: "Tải cập nhật" },
  "打开发布页": { en: "Open release page", vi: "Mở trang phát hành" },
  "稍后": { en: "Later", vi: "Để sau" },
  "当前版本": { en: "Current version", vi: "Phiên bản hiện tại" },
  "目标版本": { en: "Target version", vi: "Phiên bản đích" },
  "更新模式": { en: "Update mode", vi: "Chế độ cập nhật" },
  "便携包更新": { en: "Portable package update", vi: "Cập nhật bản portable" },
  "安装包更新": { en: "Installer package update", vi: "Cập nhật bản cài đặt" },
  "更新文件": { en: "Update file", vi: "Tệp cập nhật" },
  "建议先下载更新包，下载完成后再执行安装或重启更新。": {
    en: "It is recommended to download the update package first, then install or restart to update after the download completes.",
    vi: "Nên tải gói cập nhật trước, sau đó mới cài đặt hoặc khởi động lại để cập nhật khi tải xong.",
  },
  "正在替换更新...": { en: "Applying update...", vi: "Đang áp dụng cập nhật..." },
  "正在启动替换...": { en: "Starting replacement...", vi: "Đang bắt đầu thay thế..." },
  "正在下载更新...": { en: "Downloading update...", vi: "Đang tải cập nhật..." },
};

function interpolate(template: string, params?: Record<string, unknown>): string {
  if (!params) {
    return template;
  }

  return template.replace(/\{(\w+)\}/g, (_match, key: string) => {
    const value = params[key];
    return value == null ? "" : String(value);
  });
}

export function normalizeUiLocale(value: unknown): UiLocale {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized.startsWith("en")) {
    return "en";
  }
  if (normalized === "vi" || normalized.startsWith("vi-")) {
    return "vi";
  }
  return "zh-CN";
}

export function getHtmlLang(locale: UiLocale): string {
  if (locale === "en") {
    return "en";
  }
  if (locale === "vi") {
    return "vi";
  }
  return "zh-CN";
}

export function getIntlLocale(locale: UiLocale): string {
  if (locale === "en") {
    return "en-US";
  }
  if (locale === "vi") {
    return "vi-VN";
  }
  return "zh-CN";
}

export function syncDocumentLocale(locale: UiLocale): void {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = getHtmlLang(locale);
  document.documentElement.setAttribute("data-ui-locale", locale);
}

export function readPersistedUiLocale(): UiLocale {
  if (typeof window === "undefined") {
    return DEFAULT_UI_LOCALE;
  }

  try {
    const storedValue = window.localStorage.getItem(UI_LOCALE_STORAGE_KEY);
    if (storedValue) {
      return normalizeUiLocale(storedValue);
    }
  } catch {}

  return normalizeUiLocale(window.navigator.language);
}

export function persistUiLocale(locale: UiLocale): void {
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(UI_LOCALE_STORAGE_KEY, locale);
    } catch {}
  }
  syncDocumentLocale(locale);
}

export function getRuntimeUiLocale(): UiLocale {
  if (typeof document !== "undefined") {
    const attrValue =
      document.documentElement.getAttribute("data-ui-locale") ||
      document.documentElement.lang;
    if (attrValue) {
      return normalizeUiLocale(attrValue);
    }
  }

  return readPersistedUiLocale();
}

export function selectLocaleText(
  locale: UiLocale,
  overrides: Record<UiLocale, string>,
  params?: Record<string, unknown>,
): string {
  return interpolate(overrides[locale] || overrides["zh-CN"], params);
}

export function translateText(
  locale: UiLocale,
  sourceText: string,
  params?: Record<string, unknown>,
  overrides?: LocaleOverrides,
): string {
  if (!sourceText) {
    return "";
  }

  const normalizedLocale = normalizeUiLocale(locale);
  const template =
    overrides?.[normalizedLocale] ||
    (normalizedLocale === "zh-CN"
      ? sourceText
      : UI_TRANSLATIONS[sourceText]?.[normalizedLocale] ||
        overrides?.["zh-CN"] ||
        sourceText);

  return interpolate(template, params);
}

type TranslationPattern = {
  sourceText: string;
  regex: RegExp;
  placeholders: string[];
};

let translationPatternsCache: TranslationPattern[] | null = null;

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function getTranslationPatterns(): TranslationPattern[] {
  if (translationPatternsCache) {
    return translationPatternsCache;
  }

  translationPatternsCache = Object.keys(UI_TRANSLATIONS)
    .filter((sourceText) => sourceText.includes("{"))
    .map((sourceText) => {
      const placeholders: string[] = [];
      let lastIndex = 0;
      let regexSource = "";
      const matches = Array.from(sourceText.matchAll(/\{(\w+)\}/g));

      for (const match of matches) {
        const key = match[1];
        const index = match.index ?? 0;
        placeholders.push(key);
        regexSource += escapeRegex(sourceText.slice(lastIndex, index));
        regexSource += `(?<${key}>.+?)`;
        lastIndex = index + match[0].length;
      }
      regexSource += escapeRegex(sourceText.slice(lastIndex));

      return {
        sourceText,
        regex: new RegExp(`^${regexSource}$`),
        placeholders,
      };
    });

  return translationPatternsCache;
}

export function translateDynamicText(
  locale: UiLocale,
  text: string,
): string {
  const sourceText = String(text || "");
  if (!sourceText || locale === "zh-CN") {
    return sourceText;
  }

  const direct = translateText(locale, sourceText);
  if (direct !== sourceText) {
    return direct;
  }

  for (const pattern of getTranslationPatterns()) {
    const match = pattern.regex.exec(sourceText);
    if (!match) {
      continue;
    }

    const params = pattern.placeholders.reduce<Record<string, unknown>>((result, key) => {
      result[key] = match.groups?.[key] || "";
      return result;
    }, {});

    const translated = translateText(locale, pattern.sourceText, params);
    if (translated !== pattern.sourceText) {
      return translated;
    }
  }

  return sourceText;
}

export const localeInitScript = `(() => {
  try {
    const key = ${JSON.stringify(UI_LOCALE_STORAGE_KEY)};
    const raw = window.localStorage.getItem(key) || navigator.language || "zh-CN";
    const value = /^en/i.test(raw) ? "en" : /^(vi|vi-)/i.test(raw) ? "vi" : "zh-CN";
    document.documentElement.lang = value === "zh-CN" ? "zh-CN" : value;
    document.documentElement.setAttribute("data-ui-locale", value);
  } catch {
    document.documentElement.lang = "zh-CN";
    document.documentElement.setAttribute("data-ui-locale", "zh-CN");
  }
})();`;
