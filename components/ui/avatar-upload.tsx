"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Camera, Upload, RotateCw, ZoomIn, Check, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface AvatarUploadProps {
  currentSrc?: string
  name: string
  size?: "sm" | "md" | "lg" | "xl"
  onAvatarChange?: (newSrc: string) => void
  editable?: boolean
  className?: string
}

export function AvatarUpload({
  currentSrc,
  name,
  size = "lg",
  onAvatarChange,
  editable = true,
  className,
}: AvatarUploadProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [zoom, setZoom] = useState([1])
  const [rotation, setRotation] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const sizeConfig = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setIsOpen(true)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    if (selectedImage && onAvatarChange) {
      onAvatarChange(selectedImage)
      setIsOpen(false)
      setSelectedImage(null)
      setZoom([1])
      setRotation(0)
      toast.success("头像已更新")
    }
  }

  const handleCancel = () => {
    setIsOpen(false)
    setSelectedImage(null)
    setZoom([1])
    setRotation(0)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <>
      <div className={cn("relative group", className)}>
        <Avatar className={cn(sizeConfig[size], "ring-2 ring-white/20 transition-all duration-200")}>
          <AvatarImage src={currentSrc || "/placeholder.svg"} alt={name} />
          <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            {name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {editable && (
          <Button
            size="icon"
            variant="secondary"
            className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={triggerFileInput}
          >
            <Camera className="w-4 h-4" />
          </Button>
        )}

        {editable && (
          <div
            className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={triggerFileInput}
          >
            <Upload className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>编辑头像</DialogTitle>
            <DialogDescription>调整您的头像图片，支持缩放和旋转</DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {selectedImage && (
              <div className="flex justify-center">
                <div className="relative w-48 h-48 rounded-full overflow-hidden border-4 border-muted">
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="预览"
                    className="w-full h-full object-cover transition-transform duration-200"
                    style={{
                      transform: `scale(${zoom[0]}) rotate(${rotation}deg)`,
                    }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex items-center">
                  <ZoomIn className="w-4 h-4 mr-2" />
                  缩放: {zoom[0].toFixed(1)}x
                </Label>
                <Slider value={zoom} onValueChange={setZoom} min={0.5} max={3} step={0.1} className="w-full" />
              </div>

              <div className="flex items-center justify-between">
                <Label className="flex items-center">
                  <RotateCw className="w-4 h-4 mr-2" />
                  旋转: {rotation}°
                </Label>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline" onClick={() => setRotation((prev) => prev - 90)}>
                    -90°
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setRotation((prev) => prev + 90)}>
                    +90°
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                取消
              </Button>
              <Button onClick={handleSave}>
                <Check className="w-4 h-4 mr-2" />
                保存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

// 简化版头像上传组件
export function SimpleAvatarUpload({
  currentSrc,
  name,
  size = "md",
  onAvatarChange,
  className,
}: Omit<AvatarUploadProps, "editable">) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("图片大小不能超过5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const newSrc = e.target?.result as string
        if (onAvatarChange) {
          onAvatarChange(newSrc)
          toast.success("头像已更新")
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const sizeConfig = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  }

  return (
    <div className={cn("relative group cursor-pointer", className)} onClick={() => fileInputRef.current?.click()}>
      <Avatar
        className={cn(
          sizeConfig[size],
          "ring-2 ring-white/20 hover:ring-4 hover:ring-blue-500/30 transition-all duration-200",
        )}
      >
        <AvatarImage src={currentSrc || "/placeholder.svg"} alt={name} />
        <AvatarFallback className="text-lg font-semibold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
          {name.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <Camera className="w-6 h-6 text-white" />
      </div>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
    </div>
  )
}
