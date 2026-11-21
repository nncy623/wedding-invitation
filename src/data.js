export const wedding = {
  groom: '袁野',
  bride: '吴倩金',
  date: '2027-01-15',
  lunarDate: '农历腊月初八',
  venue: '绍兴苏宁希尔顿酒店',
  address: '浙江省绍兴市越城区横湖路100号',
  city: '绍兴',
  mapKeyword: '绍兴苏宁希尔顿酒店及公寓',
  signInTime: '',
  ceremonyTime: '',
  banquetTime: '',
  music: 'audio.m4a',
}

export function assetUrl(file) {
  return window.__weddingPreviewAssets?.[file]
    ?? new URL(import.meta.env.BASE_URL + 'reference/' + file, document.baseURI).href
}

export const copy = {
  intro: '当您收到这封请柬时\n我们的婚礼已经进入了倒计时\n很开心这一天您为我们而来',
  before: '在此之前\n我们或许从未详尽地向您讲述我们的故事\n亦或在更迭的岁月中许久未见\n日出日落 四季往复',
  ordinary: '我们普通又隆重地爱着彼此\n生活里的每一个细节\n每一个日常\n这些碎片组成我们的爱情\n让我们在一起的日子闪闪发光',
  encounter: '遇到你之后，才知道“喜欢”是有具体模样的\n是散步时自然牵住我的手\n是哪怕聊废话也觉得开心的时光\n原来爱不用轰轰烈烈，平平淡淡的日常里\n藏着最踏实的幸福',
  invitation: '婚礼，是一场美好且具有意义的仪式\n在此\n我们偕同双方父母诚挚邀请您同家人前来\n见证我们的人生瞬间',
  tips: '如果您时间充裕\n可以提前到达\n带着与我们的趣事回忆共同迎接这一份美好',
  tips2: '现场为您准备了酒水与甜品\n您可稍作休息\n欢迎到 Photo Booth 和朋友们合照留念\n希望人生中的至爱亲朋\n在微醺、轻松与快乐中定格这一美好时刻',
  ending: '愿所爱皆所得 所想皆如愿',
}
