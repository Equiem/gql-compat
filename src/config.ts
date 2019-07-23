import tmpdir from "temp-dir";

/**
 * The opinionated name of the ignore file.
 */
export const IGNORE_FILE = ".gql-compat-ignore";

/**
 * The opinionated name of the staging directory for downloading / extracting files.
 */
export const STAGE_DIR = `${tmpdir}/.gql-compat-files`;
