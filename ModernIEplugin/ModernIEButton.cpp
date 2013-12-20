// ModernIEButton.cpp : Implementation of CModernIEButton

#include "stdafx.h"
#include "ModernIEButton.h"
#include "Utils.h"

// IObjectWithSite
STDMETHODIMP CModernIEButton::SetSite(_In_opt_ IUnknown *pUnkSite)
{
	if (pUnkSite != NULL)
	{
		CComQIPtr<IServiceProvider> sp = pUnkSite;
		HRESULT hr = sp->QueryService(IID_IWebBrowserApp, IID_IWebBrowser2, (void**)&m_spWebBrowser);
		hr = sp->QueryInterface(IID_IOleCommandTarget, (void**)&m_spTarget);
	}
	else
	{
		m_spWebBrowser.Release();
		m_spTarget.Release();
	}

	return IObjectWithSiteImpl<CModernIEButton>::SetSite(pUnkSite);
}

// IOleCommandTarget

//IE will call this method when the commandbar button or the menu is clicked.
STDMETHODIMP CModernIEButton::Exec(const GUID *pguidCmdGroup, DWORD nCmdID,
	DWORD nCmdExecOpt, VARIANTARG *pvaIn, VARIANTARG *pvaOut)
{
	CComPtr<IDispatch> spDoc;
	HRESULT hr = m_spWebBrowser->get_Document(&spDoc);
	ATLASSERT(hr == S_OK);

	if (SUCCEEDED(hr))
	{
		CComQIPtr<IHTMLDocument3> spHTMLDoc = spDoc;

		if (NULL != spHTMLDoc)
		{
			CComBSTR html;
			CComPtr<IHTMLElement> document;
			CComPtr<IHTMLWindow2> window;

			spHTMLDoc->get_documentElement(&document);
			((CComQIPtr<IHTMLDocument2>)spHTMLDoc)->get_parentWindow(&window);
			
			document->get_innerHTML(&html);
			

			ATLTRACE(CUtils::GetScriptsPath() + CAtlString("alert.js"));

			CAtlString script_path = CUtils::GetScriptsPath() + CAtlString("alert.js");

			BSTR script = CUtils::ReadFileToBSTR(script_path.GetString());

			CComVariant result;
			hr = window->execScript(
				script, 
				CComBSTR(L"JavaScript"), 
				&result);

			ATLASSERT(hr == S_OK);
		}
	}

	return S_OK;
}

STDMETHODIMP CModernIEButton::QueryStatus(const GUID *pguidCmdGroup, ULONG cCmds,
	OLECMD *prgCmds, OLECMDTEXT *pCmdText)
{
	return S_OK;
}