import type { FC, Dispatch, SetStateAction } from 'react'
import { useTranslation } from 'next-i18next'

import SettingsIcon from '@mui/icons-material/Settings'

import DinoTooltipIconButton from '@/components/mui/TooltipIconButton/TooltipIconButton'

import useDinoHeaderButtonColor from '../useHeaderButtonColor'

interface DinoSettingsButtonProps {
  setSettingsOpen: Dispatch<SetStateAction<boolean>>
}

const DinoSettingsButton: FC<DinoSettingsButtonProps> = ({
  setSettingsOpen
}) => {
  const { t } = useTranslation('common')
  const headerButtonColor = useDinoHeaderButtonColor()

  return (
    <DinoTooltipIconButton
      title={t('TOGGLE_SETTINGS_DRAWER')}
      iconButtonProps={{
        sx: { color: headerButtonColor },
        onClick: () => {
          setSettingsOpen(true)
        }
      }}
    >
      <SettingsIcon />
    </DinoTooltipIconButton>
  )
}

export default DinoSettingsButton
