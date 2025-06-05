import { AlertTriangle, ShieldAlert } from "lucide-react"
import Link from "next/link"

export default function SecurityBlockPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg text-center">
        <div className="flex justify-center mb-6">
          <div className="p-3 bg-red-100 rounded-full">
            <ShieldAlert className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">安全警告</h1>
        <p className="text-gray-600 mb-6">系统启动审查检测到潜在安全风险，应用启动已被阻止。</p>

        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
          <div className="flex items-start">
            <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-700">
                如果您是系统管理员，请检查系统日志以获取详细信息。如果您是用户，请联系系统管理员寻求帮助。
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="w-full py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md transition-colors"
          >
            返回首页
          </Link>

          <Link
            href="/system/status"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            查看系统状态
          </Link>
        </div>

        <p className="mt-6 text-xs text-gray-500">
          事件ID: {crypto.randomUUID().split("-")[0]}
          <br />
          时间: {new Date().toLocaleString("zh-CN")}
        </p>
      </div>
    </div>
  )
}
