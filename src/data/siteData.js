export const siteData={
  title:"siteTitle",
  logo:"https://firebasestorage.googleapis.com/v0/b/photography-competition-9434e.appspot.com/o/competitionImages%2FYous3f2_use_same_colors_and_make_me_logo_of_photography_competi_3b917881-b6ac-4750-b3c0-15a21739a558.png21f361d8-68f3-4a2b-b815-6012769033aa?alt=media&token=060658ab-e914-4674-a86e-268bbcae09a9"
  
}

export const routesAdmin = [
  { path: '/create-competition', label: 'New competition' },
  { path: '/competitions-list', label: 'Competitions' },
  { path: '/winner-posts', label: 'Photos to sell' },
  { path: '/user-profile', label: 'Profile' },
]

export  const routerUser = [
  { path: '/competitions-list', label: 'Competitions' },
  { path: '/winner-posts', label: 'Gallery' },
  { path: '/user-profile', label: 'Profile' },
]

export const notLoggedINUser = [
  { path: '/competitions-list', label: 'Competitions' },
]
export const sideFooter = [
  { path: '/login', label: 'Login' },
  { path: '/register', label: 'Register' }
]