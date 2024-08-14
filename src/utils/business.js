export const getHight = (that, serchDiv, heightObj) => {
  // if (!that.$refs[serchDiv]) return
  const serchDivH = that.$refs[serchDiv]?.$el.offsetHeight || 0 // 64
  // 100 是顶部固定的高度, 48是card 的padding 上下, 64是搜索框的高度（变量需获取）24 是<br/> 标签，
  // 24是table  card small padding 上下，32 是表格内的按钮操作的高度
  // 64 是分页的高度+上下margin的距离
  // 54 是table 表头的高度
  // const headerFixedHeight = 100  // 100 是顶部固定的高度
  // const bodyCardHeight = 48  // 48是card 的padding 上下
  // const brHeight = 24 // 是<br/> 标签
  // const tableCardSmall = 24 // 24是table  card small padding 上下
  // const tableBtnHeight = 32 // 32 是表格内的按钮操作的高度
  // const tablePageAgeHeight = 64  // 64 是分页的高度+上下margin的距离
  // const tableHeaderHeight = 54  // 54 是table 表头的高度
  const { headerFixedHeight, bodyCardHeight, brHeight, tableCardSmall, tableBtnHeight, tablePageAgeHeight, tableHeaderHeight } = heightObj
  const allHeight = (headerFixedHeight || 0) + (bodyCardHeight || 0) + (serchDivH || 0) + (brHeight || 0) + (tableCardSmall || 0) + (tableBtnHeight || 0) + (tablePageAgeHeight || 0) + (tableHeaderHeight || 0)
  return window.innerHeight - allHeight > 0 ? window.innerHeight - allHeight : 200
}

export const scrollIntoViews = (that, e) => {
  that.$refs[e.key].$el.scrollIntoView({
    behavior: 'smooth', // 平滑过渡
    block: 'center' // 上边框与视窗顶部平齐。默认值
  });
}
