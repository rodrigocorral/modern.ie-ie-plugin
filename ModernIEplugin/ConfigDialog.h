// ConfigDialog.h : Declaration of the CConfigDialog

#pragma once

#include "resource.h"       // main symbols

#include <atlhost.h>

using namespace ATL;

// CConfigDialog

class CConfigDialog : 
	public CAxDialogImpl<CConfigDialog>
{
public:
	CConfigDialog()
	{
	}

	~CConfigDialog()
	{
		LSTATUS key_operation_status = m_modernIE_reg_key.Close();
		ATLASSERT(key_operation_status == ERROR_SUCCESS);
	}

	enum { IDD = IDD_CONFIGDIALOG };

BEGIN_MSG_MAP(CConfigDialog)
	MESSAGE_HANDLER(WM_INITDIALOG, OnInitDialog)
	COMMAND_HANDLER(IDOK, BN_CLICKED, OnClickedOK)
	COMMAND_HANDLER(IDCANCEL, BN_CLICKED, OnClickedCancel)
	CHAIN_MSG_MAP(CAxDialogImpl<CConfigDialog>)
END_MSG_MAP()

// Handler prototypes:
//  LRESULT MessageHandler(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled);
//  LRESULT CommandHandler(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled);
//  LRESULT NotifyHandler(int idCtrl, LPNMHDR pnmh, BOOL& bHandled);

	LRESULT OnInitDialog(UINT uMsg, WPARAM wParam, LPARAM lParam, BOOL& bHandled)
	{
		CAxDialogImpl<CConfigDialog>::OnInitDialog(uMsg, wParam, lParam, bHandled);
		bHandled = TRUE;
		CenterWindow();
		LoadSettings();
		return 1;  // Let the system set the focus
	}

	LRESULT OnClickedOK(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
	{
		SaveSettings();
		EndDialog(wID);
		return 0;
	}

	LRESULT OnClickedCancel(WORD wNotifyCode, WORD wID, HWND hWndCtl, BOOL& bHandled)
	{
		EndDialog(wID);
		return 0;
	}

private:

	CRegKey m_modernIE_reg_key;

	void OpenOrCreateModernIEKey()
	{
		LSTATUS key_operation_status = m_modernIE_reg_key.Create(HKEY_CURRENT_USER, _T("Software\\Microsoft\\ModernIE"));
		ATLASSERT(key_operation_status == ERROR_SUCCESS);
	}

	void SaveSettings()
	{
		OpenOrCreateModernIEKey();
		
		BSTR bstrServerAddress = NULL;
		this->GetDlgItemText(IDC_SERVER_ADDRESS_EDIT, bstrServerAddress);
		
		LSTATUS key_operation_status = m_modernIE_reg_key.SetStringValue(_T("ServerAddress"), W2T(bstrServerAddress));
		ATLASSERT(key_operation_status == ERROR_SUCCESS);
		
	}

	void LoadSettings()
	{
		OpenOrCreateModernIEKey();

		TCHAR ServerAddressKeyValue[2048];
		ULONG pnChars = sizeof(ServerAddressKeyValue) / sizeof(TCHAR);
		ZeroMemory(ServerAddressKeyValue, pnChars);
		
		LSTATUS key_operation_status = m_modernIE_reg_key.QueryStringValue(_T("ServerAddress"), ServerAddressKeyValue, &pnChars);
		ATLASSERT(key_operation_status == ERROR_SUCCESS);

		this->SetDlgItemText(IDC_SERVER_ADDRESS_EDIT, ServerAddressKeyValue);
	}
};


