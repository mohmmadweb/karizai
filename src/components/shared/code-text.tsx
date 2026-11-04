import { Fragment } from "react";

const token = /([A-Za-z][A-Za-z0-9]*(?:[-_.][A-Za-z0-9]+)+)/;

/** Text where Latin codes such as QC-SOP-07 or PP-T20 stay on one line and keep their order inside Persian. */
export function CodeText({ children }: { children: string }) {
  return <>{children.split(token).map((part, index) => (index % 2 === 1 ? <bdi key={index} className="whitespace-nowrap">{part}</bdi> : <Fragment key={index}>{part}</Fragment>))}</>;
}
