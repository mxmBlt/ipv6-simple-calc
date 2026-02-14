import { ResultGrid } from "./ResultGrid";
import { ResultRow } from "./ResultRow";
import {
  calculateIPv6,
  calculateSubnetsPage,
  type IPv6Result,
  type IPv6Input,
  type SubnetPageResult,
} from "../utils/ipv6";
import { Network } from "./Network";
import { useEffect, useMemo, useState } from "react";

interface TableProps {
  input: IPv6Input;
}

export function Table({ input }: TableProps) {
  const PAGE_SIZE = 50;
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [input.address, input.prefix, input.subnetsPrefix]);

  const result: IPv6Result = calculateIPv6(input.address, input.prefix);
  const subnetsPage: SubnetPageResult | null =
    input.subnetsPrefix !== undefined
      ? calculateSubnetsPage(
          input.address,
          input.prefix,
          input.subnetsPrefix,
          page,
          PAGE_SIZE,
        )
      : null;
  const totalSubnets = subnetsPage ? subnetsPage.total : 0n;

  const totalPagesBigInt = useMemo(() => {
    if (totalSubnets === 0n) return 1n;
    return (totalSubnets + BigInt(PAGE_SIZE) - 1n) / BigInt(PAGE_SIZE);
  }, [totalSubnets]);

  useEffect(() => {
    if (!subnetsPage) return;
    const maxPageSafe =
      totalPagesBigInt > BigInt(Number.MAX_SAFE_INTEGER)
        ? Number.MAX_SAFE_INTEGER
        : Number(totalPagesBigInt);

    if (page > maxPageSafe) {
      setPage(maxPageSafe);
    } else if (page < 1) {
      setPage(1);
    }
  }, [page, subnetsPage, totalPagesBigInt]);

  const isPrevDisabled = page <= 1 || Boolean(subnetsPage?.error);
  const isNextDisabled =
    subnetsPage === null ||
    Boolean(subnetsPage.error) ||
    BigInt(page) >= totalPagesBigInt;

  const goPrev = () => setPage((p) => (p <= 1 ? 1 : p - 1));
  const goNext = () =>
    setPage((p) => {
      const candidate = p + 1;
      return BigInt(candidate) > totalPagesBigInt ? p : candidate;
    });

  return (
    <>
      {/* Network Details */}
      <ResultGrid title={`Network (/${input.prefix})`}>
        <ResultRow
          label="Input Address"
          value={result.mainBlock.network}
          prefix={result.mainBlock.prefixLength}
        />
        <Network result={result} />
      </ResultGrid>

      {/* Subnets */}
      {subnetsPage && input.subnetsPrefix !== undefined && (
        <ResultGrid
          title={`Subnets (page ${page}/${totalPagesBigInt.toString()} • total ${totalSubnets.toString()})`}
        >
          {subnetsPage.error && (
            <div className="input-form-error-message">{subnetsPage.error}</div>
          )}

          {!subnetsPage.error && subnetsPage.subnets.length === 0 && (
            <div className="input-form-help-text">
              Aucun sous-réseau pour cette page.
            </div>
          )}

          {subnetsPage.subnets.map((subnet, index) => (
            <Network
              key={index}
              result={subnet}
              prefix={input.prefix} // mask1
              subPrefix={input.subnetsPrefix} // mask2
            />
          ))}

          <div className="pagination">
            <button
              type="button"
              className="input-form-button"
              disabled={isPrevDisabled}
              onClick={goPrev}
            >
              Previous
            </button>
            <span className="pagination-info">
              Page {page} / {totalPagesBigInt.toString()}
            </span>
            <button
              type="button"
              className="input-form-button"
              disabled={isNextDisabled}
              onClick={goNext}
            >
              Next
            </button>
          </div>
        </ResultGrid>
      )}
    </>
  );
}
