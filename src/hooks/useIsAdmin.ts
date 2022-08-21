import { useRouter } from 'next/router'
import { useSelector } from 'react-redux'

import { AccessLevels, Apps } from '@/constants/app'
import { selectUser } from '@/redux-selectors'
import { isValidApp } from '@/utils'

export const useIsSuperAdmin = (): { isSuperAdmin: boolean } => {
  const user = useSelector(selectUser)
  const router = useRouter()
  const targetApp = router.query.appAbbreviation as Apps

  if (user === null) {
    return { isSuperAdmin: false }
  }

  if (!isValidApp(targetApp)) {
    return { isSuperAdmin: false }
  }

  return {
    isSuperAdmin: user.accessLevel[targetApp] === AccessLevels.SUPER_ADMIN
  }
}

export const useIsAdminOrAbove = (): { isAdminOrAbove: boolean } => {
  const user = useSelector(selectUser)
  const router = useRouter()
  const targetApp = router.query.appAbbreviation as Apps

  if (user === null) {
    return { isAdminOrAbove: false }
  }

  if (!isValidApp(targetApp)) {
    return { isAdminOrAbove: false }
  }

  return {
    isAdminOrAbove:
      user.accessLevel[targetApp] === AccessLevels.SUPER_ADMIN ||
      user.accessLevel[targetApp] === AccessLevels.ADMIN
  }
}
