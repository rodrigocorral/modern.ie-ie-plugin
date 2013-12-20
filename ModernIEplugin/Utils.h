#pragma once

#include <atlstr.h>
using namespace ATL;

class CUtils
{
public:
	CUtils();
	virtual ~CUtils();

	static HINSTANCE hInstance;
	static CString GetScriptsPath();
	static BSTR ReadFileToBSTR(LPCWSTR lpFileName);

private:
	static CString GetPluginPath();
};

