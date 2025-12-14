


export interface NaviTem {
    to:string,
    label:string,
    description?:string
}


export const navigationItems:NaviTem[] = [
    {to:'/',label:'Главная'},

]


export const addNavItem = (itemLink:NaviTem) => {
    const check = navigationItems.some(item => item.to === itemLink.to)
    if(!check) {
        navigationItems.push(itemLink)
    } return navigationItems
}