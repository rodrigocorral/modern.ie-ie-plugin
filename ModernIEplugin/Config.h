#pragma once
#include <atlbase.h>
#include <atlstr.h>

using namespace ATL;

class CConfig
{
public:
	CConfig();
	~CConfig();
	CAtlString GetServerAddress();
	void SetSeverAddress(const CAtlString& serverAddress);
};

