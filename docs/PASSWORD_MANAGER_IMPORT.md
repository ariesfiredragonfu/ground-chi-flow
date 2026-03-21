# Import into a password manager

The assistant **cannot** log into Bitwarden, 1Password, or iCloud Keychain for you. Use the CSV on your Desktop:

**`~/Desktop/admin-howell-forge/password-manager-import-template.csv`**

## Bitwarden (web)

1. Unlock Bitwarden → **Tools** → **Import data**.
2. Format: **Bitwarden (csv)** or **Chrome CSV** (depending on template columns).
3. Upload the CSV, then **edit each row** and paste the **real** password (after you set it in Firebase / Railway / Jellyfin).

## 1Password

1. **File → Import** and pick the CSV format your template matches, or create entries manually using the same titles/URLs.

## After GCF admin rotation

1. Set new password in **Firebase** for `admin@groundchiflow.com`.
2. Paste that password into the password manager entry for GCF admin.
3. Leave no copy on Desktop except this import flow (optional).
