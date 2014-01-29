// ModernIEButton.cpp : Implementation of CModernIEButton

#include "stdafx.h"
#include "ModernIEButton.h"
#include "ConfigDialog.h"
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
	CConfigDialog d;
	d.DoModal();
	
	CComPtr<IDispatch> spDoc;
	HRESULT hr = m_spWebBrowser->get_Document(&spDoc);

	if (SUCCEEDED(hr))
	{
		CComQIPtr<IHTMLDocument3> spHTMLDoc3 = spDoc;
		CComQIPtr<IHTMLDocument2> spHTMLDoc2 = spDoc;
		CComPtr<IHTMLElement> docElement;
		CComPtr<IHTMLWindow2> window;

		spHTMLDoc3->get_documentElement(&docElement);
		spHTMLDoc2->get_parentWindow(&window);

		CComPtr<IHTMLElement> body;
		CComPtr<IHTMLDOMNode> body_node;
		spHTMLDoc2->get_body(&body);
		body->QueryInterface(IID_IHTMLDOMNode, (void**)&body_node);

		CAtlString modern_css_path = CUtils::GetCSSsPath() + CAtlString("modern.css");
		CUtils::InjectStyleFromLocalFile(spHTMLDoc2, body_node, modern_css_path);

		CAtlString locale_script_path = CUtils::GetScriptsPath() + CAtlString("locale.js");
		CUtils::InjectScriptFromLocalFile(spHTMLDoc2, body_node, locale_script_path);

		CAtlString crawler_data_script_path = CUtils::GetScriptsPath() + CAtlString("crawler-data-ie.js");
		CUtils::InjectScriptFromLocalFile(spHTMLDoc2, body_node, crawler_data_script_path);

		CAtlString crawler_script_path = CUtils::GetScriptsPath() + CAtlString("crawler.js");
		CUtils::InjectScriptFromLocalFile(spHTMLDoc2, body_node, crawler_script_path);

		CAtlString start_script_path = CUtils::GetScriptsPath() + CAtlString("main.js");
		CUtils::InjectScriptFromLocalFile(spHTMLDoc2, body_node, start_script_path);
	}

	return S_OK;
}

STDMETHODIMP CModernIEButton::QueryStatus(const GUID *pguidCmdGroup, ULONG cCmds,
	OLECMD *prgCmds, OLECMDTEXT *pCmdText)
{
	return S_OK;
}