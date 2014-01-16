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
		CComQIPtr<IHTMLDocument3> spHTMLDoc3 = spDoc;
		CComQIPtr<IHTMLDocument2> spHTMLDoc2 = spDoc;
		CComPtr<IHTMLElement> docElement;
		CComPtr<IHTMLWindow2> window;

		spHTMLDoc3->get_documentElement(&docElement);
		spHTMLDoc2->get_parentWindow(&window);

		//CComPtr<IHTMLStyleSheet> style_sheet;
		//hr = spHTMLDoc2->createStyleSheet(CComBSTR(""), 0, &style_sheet);
		//ATLENSURE(hr == S_OK);

		//BSTR css = CUtils::ReadFileToBSTR(css_path.GetString());
		//hr = style_sheet->put_cssText(css);
		//ATLENSURE(hr == S_OK);


		CComPtr<IHTMLElement> body;
		CComPtr<IHTMLDOMNode> body_node;
		spHTMLDoc2->get_body(&body);
		body->QueryInterface(IID_IHTMLDOMNode, (void**)&body_node);

		CAtlString start_script_path = CUtils::GetScriptsPath() + CAtlString("start.js");
		BSTR start_script = CUtils::ReadFileToBSTR(start_script_path);

		CComVariant result;
		hr = window->execScript(start_script, CComBSTR(L"JavaScript"), &result);
		ATLENSURE(hr == S_OK);

		//CAtlString crawler_script_path = CUtils::GetScriptsPath() + CAtlString("crawler.js");
		//CUtils::InjectScript(spHTMLDoc2, body_node, CComBSTR(crawler_script_path));

		//CAtlString modern_css_path = CUtils::GetCSSsPath() + CAtlString("modern.css");
		//CUtils::InjectLink(spHTMLDoc2, body_node, _T("stylesheet"), _T("text/css"), CComBSTR(modern_css_path));
	}

	return S_OK;
}

STDMETHODIMP CModernIEButton::QueryStatus(const GUID *pguidCmdGroup, ULONG cCmds,
	OLECMD *prgCmds, OLECMDTEXT *pCmdText)
{
	return S_OK;
}