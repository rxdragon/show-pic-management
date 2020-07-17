export default class Rules {
  name = []
  desc = [
    { required: true, message: '请输入下单说明', trigger: 'blur' }
  ]
  thumbnailList = [
    { required: true, message: '请上传缩略图', trigger: 'change' }
  ]

  constructor (type) {
    switch (type) {
      case 'style':
        this.name.push({ required: true, message: '请输入修图风格名称', trigger: 'blur' })
        break
      case 'upgrade':
        this.name.push({ required: true, message: '请输入升级体验名称', trigger: 'blur' })
        break
    
      default:
        break
    }
  }
}
