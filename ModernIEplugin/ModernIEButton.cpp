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
	ATLENSURE(hr == S_OK);

	if (SUCCEEDED(hr))
	{
		CComQIPtr<IHTMLDocument3> spHTMLDoc = spDoc;

		if (NULL != spHTMLDoc)
		{
			CComPtr<IHTMLElement> docElement;
			CComPtr<IHTMLWindow2> window;

			spHTMLDoc->get_documentElement(&docElement);
			((CComQIPtr<IHTMLDocument2>)spHTMLDoc)->get_parentWindow(&window);
			
			CAtlString script_path = CUtils::GetScriptsPath() + CAtlString("alert.js");
			ATLTRACE(script_path);
			BSTR script = CUtils::ReadFileToBSTR(script_path.GetString());

			CComVariant result;
			hr = window->execScript(
				script, 
				CComBSTR(L"JavaScript"), 
				&result);

			ATLENSURE(hr == S_OK);

			CAtlString css_path = CUtils::GetScriptsPath() + CAtlString("test.css");
			ATLTRACE(css_path);

			CComPtr<IHTMLStyleSheet> style_sheet;
			hr = ((CComQIPtr<IHTMLDocument2>)spHTMLDoc)->createStyleSheet(CComBSTR(""), 0, &style_sheet);
			ATLENSURE(hr == S_OK);

			BSTR css = CUtils::ReadFileToBSTR(css_path.GetString());
			hr = style_sheet->put_cssText(css);
			ATLENSURE(hr == S_OK);
		}
	}

	return S_OK;
}

STDMETHODIMP CModernIEButton::QueryStatus(const GUID *pguidCmdGroup, ULONG cCmds,
	OLECMD *prgCmds, OLECMDTEXT *pCmdText)
{
	return S_OK;
}