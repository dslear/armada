import { useState } from "react"

import { ContentCopy } from "@mui/icons-material"
import { IconButton, IconButtonProps, styled, SvgIcon, Tooltip } from "@mui/material"

const LEAVE_DELAY_MS = 1_000

const StyledIconButton = styled(IconButton)<IconButtonProps & { hidden: boolean }>(({ hidden }) => ({
  visibility: hidden ? "hidden" : "unset",
}))

export interface CopyColumnButtonProps<T> {
  data: T[]
  columnAccessor: (item: T) => string | number | undefined | null
  columnName: string
  size?: IconButtonProps["size"]
  onClick?: IconButtonProps["onClick"]
  hidden?: boolean
  Icon?: typeof SvgIcon
  copiedTooltipTitle?: string
  separator?: string
}

export const CopyColumnButton = <T,>({
  data,
  columnAccessor,
  columnName,
  size,
  onClick,
  hidden = false,
  Icon = ContentCopy,
  copiedTooltipTitle,
  separator = "\n",
}: CopyColumnButtonProps<T>) => {
  const [tooltipOpen, setTooltipOpen] = useState(false)

  const copyColumnData = () => {
    const columnData = data
      .map(item => columnAccessor(item))
      .filter(value => value !== undefined && value !== null)
      .join(separator)
    
    return columnData
  }

  return (
    <Tooltip
      title={copiedTooltipTitle ?? `Copied ${columnName} column!`}
      onClose={() => setTooltipOpen(false)}
      open={tooltipOpen}
      leaveDelay={LEAVE_DELAY_MS}
      arrow={false}
    >
      <StyledIconButton
        size={size}
        onClick={(e) => {
          onClick?.(e)
          navigator.clipboard.writeText(copyColumnData())
          setTooltipOpen(true)
        }}
        aria-label={`copy ${columnName} column`}
        hidden={hidden && !tooltipOpen}
      >
        <Icon fontSize="inherit" />
      </StyledIconButton>
    </Tooltip>
  )
}