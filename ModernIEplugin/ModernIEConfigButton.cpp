// ModernIEConfigButton.cpp : Implementation of CModernIEConfigButton

#include "stdafx.h"
#include "ModernIEConfigButton.h"
#include "ConfigDialog.h"

// IObjectWithSite
STDMETHODIMP CModernIEConfigButton::SetSite(_In_opt_ IUnknown *pUnkSite)
{
	return IObjectWithSiteImpl<CModernIEConfigButton>::SetSite(pUnkSite);
}

// IOleCommandTarget

//IE will call this method when the commandbar button or the menu is clicked.
STDMETHODIMP CModernIEConfigButton::Exec(const GUID *pguidCmdGroup, DWORD nCmdID,
	DWORD nCmdExecOpt, VARIANTARG *pvaIn, VARIANTARG *pvaOut)
{
	CConfigDialog d;
	d.DoModal();

	return S_OK;
}

STDMETHODIMP CModernIEConfigButton::QueryStatus(const GUID *pguidCmdGroup, ULONG cCmds,
	OLECMD *prgCmds, OLECMDTEXT *pCmdText)
{
	return S_OK;
}

