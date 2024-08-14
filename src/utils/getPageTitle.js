const title = process.env.VUE_APP_BASE_NAME || '汽车服务业务中心';

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle}-${title}`;
  }
  return title;
}
