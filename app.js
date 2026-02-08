const toggleButton = document.getElementById('toggle-btn')
const sidebar = document.getElementById('sidebar')

function setCaretForButton(button, isOpen){
  const icons = button.querySelectorAll('i')
  const caret = icons[icons.length - 1]
  if(!caret) return
  if(isOpen){
    caret.classList.remove('ri-arrow-down-s-line')
    caret.classList.add('ri-arrow-up-s-line')
  }else{
    caret.classList.remove('ri-arrow-up-s-line')
    caret.classList.add('ri-arrow-down-s-line')
  }
}

function setToggleIconBySidebarState(){
  const icon = toggleButton.querySelector('i')
  if(!icon) return
  if(sidebar.classList.contains('close')){
    icon.classList.remove('ri-arrow-left-double-line')
    icon.classList.add('ri-arrow-right-double-line')
  }else{
    icon.classList.remove('ri-arrow-right-double-line')
    icon.classList.add('ri-arrow-left-double-line')
  }
}

function toggleSidebar(){
  sidebar.classList.toggle('close')
  toggleButton.classList.toggle('rotate')

  closeAllSubMenus()
  setToggleIconBySidebarState()
}

function toggleSubMenu(button){

  if(!button.nextElementSibling.classList.contains('show')){
    closeAllSubMenus()
  }

  button.nextElementSibling.classList.toggle('show')
  button.classList.toggle('rotate')
  const isOpen = button.nextElementSibling.classList.contains('show')
  setCaretForButton(button, isOpen)

  const isMobile = window.innerWidth <= 800
  const isTeamsBtn = button.querySelector('span')?.textContent.trim() === 'Teams'

  if(isMobile && isTeamsBtn){
    const currentPage = getCurrentPageName()
    const currentTeamLink = sidebar.querySelector(`.sub-menu a[href="${currentPage}"]`)

    if(isOpen){
      button.classList.remove('active')
      if(currentTeamLink) currentTeamLink.classList.add('active')
    } else {
      button.classList.add('active')
      if(currentTeamLink) currentTeamLink.classList.remove('active')
    }
  }

  if(sidebar.classList.contains('close')){
    sidebar.classList.toggle('close')
    toggleButton.classList.toggle('rotate')
    setToggleIconBySidebarState()
  }
}

function closeAllSubMenus(){
  Array.from(sidebar.getElementsByClassName('show')).forEach(ul => {
    ul.classList.remove('show')
    ul.previousElementSibling.classList.remove('rotate')
    setCaretForButton(ul.previousElementSibling, false)
  })
}

// initialize the correct icon based on initial state
setToggleIconBySidebarState()

// Highlight Rechts-Links based on hash (#impressum | #datenschutz)
function setActiveLegalByHash(){
  const defaultHash = '#impressum'
  const current = location.hash || defaultHash

  const impressumLi = sidebar.querySelector('.sub-menu li > a[href="#impressum"]')?.parentElement
  const datenschutzLi = sidebar.querySelector('.sub-menu li > a[href="#datenschutz"]')?.parentElement

  if(impressumLi) impressumLi.classList.remove('active')
  if(datenschutzLi) datenschutzLi.classList.remove('active')

  const activeLi = sidebar.querySelector(`.sub-menu li > a[href="${current}"]`)?.parentElement
  if(activeLi){
    activeLi.classList.add('active')

    // ensure the "Rechtliches" submenu is open so active is visible
    const legalBtn = Array.from(sidebar.querySelectorAll('.dropdown-btn')).find(btn => btn.querySelector('span')?.textContent.trim() === 'Rechtliches')
    if(legalBtn && legalBtn.nextElementSibling){
      legalBtn.nextElementSibling.classList.add('show')
      legalBtn.classList.add('rotate')
      setCaretForButton(legalBtn, true)
    }
  }
}

window.addEventListener('hashchange', setActiveLegalByHash)

// Initialize active state on first load
document.addEventListener('DOMContentLoaded', () => {
  if(!location.hash){
    location.hash = '#impressum'
  }
  setActiveLegalByHash()
  setTeamActiveState()
})

function getCurrentPageName(){
  const path = window.location.pathname
  const lastSegment = path.substring(path.lastIndexOf('/') + 1)
  return lastSegment || 'index.html'
}

// Set Team page active state (CS2, OW, MR) based on current page
function setTeamActiveState(){
  const teamsBtn = Array.from(sidebar.querySelectorAll('.dropdown-btn')).find(btn => btn.querySelector('span')?.textContent.trim() === 'Teams')
  const currentPage = getCurrentPageName()
  const teamPages = ['cs2.html', 'ow.html', 'mr.html']
  const isMobile = window.innerWidth <= 800

  if(!teamPages.includes(currentPage)) return

  const currentTeamLink = sidebar.querySelector(`.sub-menu a[href="${currentPage}"]`)

  if(isMobile){
    if(teamsBtn) teamsBtn.classList.add('active')
    if(currentTeamLink) currentTeamLink.classList.remove('active')
    return
  }

  if(teamsBtn) teamsBtn.classList.add('active')
  if(currentTeamLink) currentTeamLink.classList.add('active')

  const teamsMenu = teamsBtn?.nextElementSibling
  if(teamsMenu && !teamsMenu.classList.contains('show')){
    teamsMenu.classList.add('show')
    teamsBtn.classList.add('rotate')
    setCaretForButton(teamsBtn, true)
  }
}