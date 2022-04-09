import * as React from 'react';
import { UserHistoryFragment } from 'services/generated/graphql';
import Tooltip from 'components/Tooltip';
import { formatAddress } from 'utils/address';
import { CheckIcon, XIcon, PencilIcon, ArrowRightIcon, ChevronDoubleRightIcon } from '@heroicons/react/solid';
import { useAccount } from 'wagmi';
import { MoreInfo } from './MoreInfo';
import { useDialogState } from 'ariakit';
interface ItemProps {
  data: UserHistoryFragment;
}

function formatAmtPerSec(amtPerSec: number) {
  const formatted = amtPerSec.toLocaleString('en-US', { maximumFractionDigits: 5 });
  if (formatted === '0') {
    return '0...';
  }
  return formatted;
}

export const ListItem = ({ data }: ItemProps) => {
  const moreInfoDialog = useDialogState();

  const [{ data: accountData }] = useAccount();
  const account = accountData?.address.toLowerCase();
  const eventType = data.eventType;
  const payer = data.stream.payer.id;
  const payee = data.stream.payee.id;
  const amtPerSec = data.stream.amountPerSec / 1e20;
  const oldAmtPerSec = data.oldStream?.amountPerSec / 1e20;
  const oldPayee = data.oldStream?.payee.id;
  const oldPayer = data.oldStream?.payer.id;

  return (
    <>
      <div className="flex flex-1 flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0">
        <div className="flex flex-1 items-center space-x-2 truncate">
          {eventType === 'StreamModified' ? (
            <Tooltip content="Modified Stream">
              <div className="rounded bg-yellow-100 p-1 text-yellow-600">
                <PencilIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamCreated' ? (
            <Tooltip content="Incoming stream">
              <div className="rounded bg-green-100 p-1 text-green-600">
                <CheckIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamCancelled' ? (
            <Tooltip content="Cancelled stream">
              <div className="rounded bg-red-100 p-1 text-red-600">
                <XIcon className="h-4 w-4" />
              </div>
            </Tooltip>
          ) : (
            ''
          )}
          {eventType === 'StreamModified' ? (
            <>
              {oldPayee !== undefined && oldPayer !== undefined ? (
                <>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === oldPayee ? formatAddress(oldPayer) : 'You'}
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === oldPayer ? formatAddress(oldPayee) : 'You'}
                  </span>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(oldAmtPerSec)}/sec</span>
                  <ChevronDoubleRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === payee ? formatAddress(payer) : 'You'}
                  </span>
                  <ArrowRightIcon className="h-4 w-4" />
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                    {account === payer ? formatAddress(payee) : 'You'}
                  </span>
                  <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}/sec</span>
                </>
              ) : (
                ''
              )}
            </>
          ) : (
            <>
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                {account === payee ? formatAddress(payer) : 'You'}
              </span>
              <ArrowRightIcon className="h-4 w-4" />
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]">
                {account === payer ? formatAddress(payee) : 'You'}
              </span>
              <span className="truncate sm:max-w-[32ch] md:max-w-[48ch]"> {formatAmtPerSec(amtPerSec)}/sec</span>
            </>
          )}
        </div>

        <button
          onClick={moreInfoDialog.toggle}
          className="w-full whitespace-nowrap rounded bg-zinc-100 py-1 px-2 dark:bg-zinc-800 sm:w-min"
        >
          More Info
        </button>
        <MoreInfo data={data} dialog={moreInfoDialog} />
      </div>
    </>
  );
};
