"use client"

import { useEffect, useState } from "react"

interface ScoreDisplayProps {
  score: number
  label?: string
  animated?: boolean
  showStars?: boolean
}

export function ScoreDisplay({ score, label, animated = false, showStars = false }: ScoreDisplayProps) {
  const [displayScore, setDisplayScore] = useState(0)
  const [grade, setGrade] = useState("")

  useEffect(() => {
    // 计算等级
    if (score >= 90) setGrade("A+")
    else if (score >= 85) setGrade("A")
    else if (score >= 80) setGrade("B+")
    else if (score >= 75) setGrade("B")
    else if (score >= 70) setGrade("C+")
    else if (score >= 65) setGrade("C")
    else if (score >= 60) setGrade("D+")
    else setGrade("D")

    // 动画效果
    if (animated) {
      setDisplayScore(0)
      const interval = setInterval(() => {
        setDisplayScore((prev) => {
          if (prev >= score) {
            clearInterval(interval)
            return score
          }
          return prev + 1
        })
      }, 20)

      return () => clearInterval(interval)
    } else {
      setDisplayScore(score)
    }
  }, [score, animated])

  // 获取分数颜色
  const getScoreColor = () => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-blue-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  // 获取等级颜色
  const getGradeColor = () => {
    if (score >= 90) return "bg-green-100 text-green-800"
    if (score >= 80) return "bg-blue-100 text-blue-800"
    if (score >= 70) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  return (
    <div className="flex flex-col items-center">
      {label && <div className="text-sm text-gray-600 mb-1">{label}</div>}
      <div className="flex items-center space-x-3">
        <div className={`text-3xl font-bold ${getScoreColor()}`}>{displayScore}</div>
        <div className={`px-2 py-1 rounded-md text-sm font-medium ${getGradeColor()}`}>{grade}</div>
      </div>
      {showStars && (
        <div className="mt-2 star-rating">
          {[1, 2, 3, 4, 5].map((star) => (
            <span key={star} className={`star text-lg ${star <= Math.round(score / 20) ? "filled" : ""}`}>
              ★
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
