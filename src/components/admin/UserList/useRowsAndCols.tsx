import { useTranslation } from 'next-i18next'
import type { TFunction } from 'next-i18next'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import Avatar from '@mui/material/Avatar'
import type { GridColDef } from '@mui/x-data-grid'

import { AccessLevels, AlertColor, Apps } from '@/constants/app'
import { useUpdateEffect } from '@/hooks/useUpdateEffect'
import adminUserHttpService from '@/http-services/adminUser'
import { enqueueAlert } from '@/redux-actions'
import { selectUser } from '@/redux-selectors'
import type { User } from '@/types'

const getAdminPermissionOptions = (t: TFunction) => [
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.EDITOR}`),
    value: AccessLevels.EDITOR
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.COMMENTOR}`),
    value: AccessLevels.COMMENTOR
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.VIEWER}`),
    value: AccessLevels.VIEWER
  },
  {
    label: t(`PERMISSION_LABEL_${AccessLevels.NONE}`),
    value: AccessLevels.NONE
  }
]

const getSuperAdminPermissionOptions = (t: TFunction) =>
  [
    {
      label: t(`PERMISSION_LABEL_${AccessLevels.ADMIN}`),
      value: AccessLevels.ADMIN
    }
  ].concat(getAdminPermissionOptions(t))

const useRowsAndCols = (users: User[]) => {
  const router = useRouter()
  const user = useSelector(selectUser)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [rows, setRows] = useState<User[]>(users)
  const [isLoading, setLoading] = useState<boolean>(false)

  const appAbbreviation = router.query.appAbbreviation as Apps
  const userAppAccessLevel = user?.accessLevel[appAbbreviation as Apps]

  const valueOptions = useMemo(() => {
    if (userAppAccessLevel === AccessLevels.SUPER_ADMIN) {
      return getSuperAdminPermissionOptions(t)
    }

    if (userAppAccessLevel === AccessLevels.ADMIN) {
      return getAdminPermissionOptions(t)
    }

    return []
  }, [t, userAppAccessLevel])

  const refinedColumns: GridColDef[] = useMemo(
    () => [
      {
        field: 'image',
        headerName: t('THUMBNAIL'),
        headerAlign: 'center',
        align: 'center',
        width: 100,
        filterable: false,
        sortable: false,
        renderCell: (params) => <Avatar alt="" src={params.row.image} />
      },
      {
        field: 'name',
        headerName: t('NAME'),
        headerAlign: 'center',
        align: 'center',
        width: 200,
        filterable: false,
        sortable: false
      },
      {
        field: 'email',
        headerName: t('EMAIL'),
        headerAlign: 'center',
        align: 'center',
        width: 250,
        filterable: false,
        sortable: false
      },
      {
        field: 'permission',
        headerName: t('PERMISSION'),
        headerAlign: 'center',
        align: 'center',
        width: 200,
        editable: true,
        filterable: false,
        sortable: false,
        type: 'singleSelect',
        valueOptions,
        valueFormatter: (params) => t(`PERMISSION_LABEL_${params.value}`),
        valueSetter: (params) => {
          setRows((prevRows) =>
            prevRows!.map((prevRow) =>
              prevRow?._id === params.row._id
                ? {
                    ...prevRow,
                    accessLevel: {
                      ...prevRow.accessLevel,
                      [appAbbreviation as Apps]: params.value as AccessLevels
                    }
                  }
                : prevRow
            )
          )

          adminUserHttpService
            .editUserPermission({
              appAbbreviation,
              userId: params.row._id,
              value: params.value
            })
            .catch(() => {
              adminUserHttpService
                .getUsers({ appAbbreviation })
                .then((users) => {
                  setRows(users)
                })

              dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
            })

          return {
            ...params.row,
            accessLevel: {
              ...params.row.accessLevel,
              [appAbbreviation as Apps]: params.value as AccessLevels
            }
          }
        }
      }
    ],
    // change valueOptions means t and appAbbreviation was changed
    // so we don't need to put another dependency
    [setRows, valueOptions]
  )

  const refinedRows = useMemo(
    () =>
      rows.map((row) => ({
        ...row,
        id: row._id,
        permission: row.accessLevel[appAbbreviation]
      })),
    // change rows means appAbbreviation was changed
    // so we don't need to put another dependency
    [rows]
  )

  useUpdateEffect(() => {
    setLoading(true)

    adminUserHttpService
      .getUsers({ appAbbreviation })
      .then((users) => {
        setLoading(false)
        setRows(users)
      })
      .catch(() => {
        setLoading(false)
        setRows([])

        dispatch(enqueueAlert(AlertColor.ERROR, t('ERROR_ALERT_MESSAGE')))
      })
  }, [t, appAbbreviation])

  return { isLoading, rows: refinedRows, columns: refinedColumns }
}

export default useRowsAndCols
