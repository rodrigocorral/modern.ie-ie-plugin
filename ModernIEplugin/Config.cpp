#include "stdafx.h"
#include "Config.h"

CConfig::CConfig()
{
}


CConfig::~CConfig()
{
}

CRegKey m_modernIE_reg_key;

LPCTSTR CONFIG_KEY_NAME = _T("Software\\Microsoft\\ModernIE");
LPCTSTR SERVER_ADDRESS_KEY_NAME = _T("ServerAddress");

void OpenOrCreateModernIEKey()
{
	LSTATUS key_operation_status = m_modernIE_reg_key.Create(HKEY_CURRENT_USER, CONFIG_KEY_NAME);
	ATLASSERT(key_operation_status == ERROR_SUCCESS);
}

CAtlString CConfig::GetServerAddress()
{
	OpenOrCreateModernIEKey();

	TCHAR ServerAddressKeyValue[2048];
	ULONG pnChars = sizeof(ServerAddressKeyValue) / sizeof(TCHAR);
	ZeroMemory(ServerAddressKeyValue, pnChars);

	LSTATUS key_operation_status = m_modernIE_reg_key.QueryStringValue(SERVER_ADDRESS_KEY_NAME, ServerAddressKeyValue, &pnChars);
	ATLASSERT(key_operation_status == ERROR_SUCCESS);

	CAtlString result = CAtlString(ServerAddressKeyValue);

	if (result.IsEmpty())
		result = _T("http://127.0.0.1/package");

	return result;
}


void CConfig::SetSeverAddress(const CAtlString& serverAddress)
{
	OpenOrCreateModernIEKey();

	LSTATUS key_operation_status = m_modernIE_reg_key.SetStringValue(SERVER_ADDRESS_KEY_NAME, serverAddress);
	ATLASSERT(key_operation_status == ERROR_SUCCESS);
}
